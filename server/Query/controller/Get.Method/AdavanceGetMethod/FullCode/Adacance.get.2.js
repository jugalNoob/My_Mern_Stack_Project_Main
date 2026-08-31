import zlib from "node:zlib";
import { User } from "../../../../../model/Student.js";
import redis from "../../../../../config/redis/redisClient.js";
import l1Cache from "../../../../../config/redis/CachL1.js";
import {  buildStudentQuery } from "../Quary.Separate/Search.Quary.js";

import  { mongoBreaker } from '../../../../../config/Breaker/studentBraker.js'


import { performance } from "perf_hooks";
 import logger from "../../../../../monontring/window.log.js";
import {sendResponse} from '../Zip.Etag/Zip.js'
import Redlock from "redlock";






const redlock = new Redlock([redis], {
  retryCount: 3,
  retryDelay: 100,
  retryJitter: 50,
});





export const getUsersWithQuery = async (req, res) => {
  const rid = req.requestId;
  const requestStart = performance.now();
  const lockTTL = 5000; // 5 seconds

  try {

       console.log(`\n[${rid}] ===== NEW REQUEST =====`);
    
         logger.info("Request received", { requestId: rid });
    


    // ---------------- Pagination ----------------
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

        console.log(`[${rid}] INIT page=${page}, limit=${limit}`);
    
        logger.info("New request received", {
      requestId: rid,
      page,
      limit,
    });
    


    const query = buildStudentQuery(req.query);
    const cacheKey = `students:query:${Buffer.from(JSON.stringify({ query, page, limit })).toString("base64")}`;

    // ---------------- ETag / Version ----------------
    let version = (await redis.get("students:version")) || 1;


    const etag = `"students-v-${version}"`;
    console.log(`[${rid}] [ETAG:${etag}] Generated`);

    if (req.headers["if-none-match"] === etag) {

        console.log(`[${rid}] [ETAG:${etag}] 304 Not Modified`);
           logger.info("ETag matched - 304", { requestId: rid, etag });

      return res.status(304).end();
    }

           console.log(`[${rid}] CACHE KEY: ${cacheKey}`);

    // ---------------- L1 Cache ----------------

         const l1Start = performance.now();
    let cachedData = l1Cache.get(cacheKey);
const l1Time = performance.now() - l1Start;

    if (cachedData){
console.log(`[${rid}] L1 HIT (${l1Time.toFixed(2)}ms)`);
         logger.info("L1 HIT", { requestId: rid, durationMs: l1Time });
           console.log(
                 `[${rid}] TOTAL TIME ${(performance.now() - requestStart).toFixed(2)}ms`
               );
         return sendResponse(res, cachedData, etag);  
         
    } 
    console.log(`[${rid}] L1 MISS (${l1Time.toFixed(2)}ms) → Redis`); 

    // ---------------- L2 Cache ---------------- ::::::::::::::::::::::::::::::::::::::

        const redisStart = performance.now();
    let redisData = await redis.get(cacheKey);
    const redisTime = performance.now() - redisStart;

    if (redisData) {
            console.log(`[${rid}] L2 HIT (${redisTime.toFixed(2)}ms)`);
            logger.info("L2 HIT", { requestId: rid, durationMs: redisTime });

      const parsed = JSON.parse(redisData);
      l1Cache.set(cacheKey, parsed, 60); // short L1 TTL
      
      console.log(
              `[${rid}] TOTAL TIME ${(performance.now() - requestStart).toFixed(2)}ms`
            );
      
      return sendResponse(res, parsed, etag);
    }

        console.log(`[${rid}] L2 MISS (${redisTime.toFixed(2)}ms) → DB FETCH`);

    // ---------------- Redlock (Distributed Lock) ----------------
    let finalData;
    try {
      const lock = await redlock.acquire([`locks:${cacheKey}`], lockTTL);

      try {
        // Double-check Redis after acquiring lock
        const doubleCheck = await redis.get(cacheKey);
        if (doubleCheck) {
          finalData = JSON.parse(doubleCheck);
        } else {
          const mongoStart = performance.now();
      
   
            // 🔥 Fetch limit + 1 for hasMore
          const users = await mongoBreaker.fire({
            query,
            skip,
            limit: limit + 1
          });

  
              let hasMore = false;

          if (users.length > limit) {
            hasMore = true;
            users.pop();
          }


          let  finalData = {
            page,
            limit,
            hasMore,
            count: users.length,
            data: users
          };
       

          

          // ---------------- Null Cache / Normal Cache ----------------

          
              const mongoTime = performance.now() - mongoStart; 

                console.log(`[${rid}] DB DONE (${mongoTime.toFixed(2)}ms)`);
              
                       logger.info("Mongo completed", {
                    requestId: rid,
                    durationMs: mongoTime,
                    total,
                  });
              

          if (!data || data.length === 0) {
            finalData = { total: 0, page, limit, totalPages: 0, data: [] };
            const shortTTL = 60; // 1 min for null cache
            await redis.set(cacheKey, JSON.stringify(finalData), "EX", shortTTL);
            l1Cache.set(cacheKey, finalData, shortTTL);
          } else {
            finalData = { total, page, limit, totalPages: Math.ceil(total / limit), data };
            const ttl = 300 + Math.floor(Math.random() * 60); // random TTL for avalanche prevention
            await redis.set(cacheKey, JSON.stringify(finalData), "EX", ttl);
            l1Cache.set(cacheKey, finalData, 60); // short L1 TTL
          }
        }
      } finally {
        // Release lock
        await lock.release();
      }
    } catch (err) {
      // Lock not acquired → Stale-while-revalidate
      const staleCache = await redis.get(cacheKey) || l1Cache.get(cacheKey);
      if (staleCache) finalData = JSON.parse(staleCache);
      else finalData = { total: 0, page, limit, totalPages: 0, data: [] }; // fallback
    }

    // ---------------- Send Response ----------------
    return sendResponse(res, finalData, etag);

  } catch (error) {
    console.error(`[${rid}] ERROR:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------------- Helper: GZIP + Headers ----------------
// function sendResponse(res, data, etag) {
//   const jsonData = JSON.stringify(data);
//   const acceptEncoding = res.req.headers["accept-encoding"] || "";

//   res.setHeader("ETag", etag);
//   res.setHeader("Cache-Control", "public, max-age=60");

//   if (acceptEncoding.includes("gzip")) {
//     return zlib.gzip(jsonData, (err, compressed) => {
//       if (err) return res.status(500).json({ error: "Compression failed" });
//       res.setHeader("Content-Encoding", "gzip");
//       res.setHeader("Content-Type", "application/json");
//       return res.status(200).send(compressed);
//     });
//   }

//   return res.status(200).json(data);
// }

//Log console.log -------------------------------->>

// ================= NEW REQUEST =================
// [INIT] page=1, limit=10, skip=0
// [QUERY] { name: /john/i }
// [CACHE KEY] students:query:eyJxdWVyeSI6...
// [ETAG GENERATED] "students-v-2"
// [L1] Checking memory cache...
// [L1] ❌ MISS → Checking Redis
// [L2] ❌ MISS → Fetching from DB
// [DB] FETCH DONE in 18 ms
// [DB] Records returned: 10
// [DB] Total count: 145
// [CACHE] Setting Redis TTL = 342s (base=300, jitter=42)
// [L1] Setting memory cache
// [RESPONSE] Preparing response...
// [GZIP] Compression enabled
// [RESPONSE] Sent compressed response



// 🔥 What You Fixed Architecturally
// ✅ 1. Dynamic Cache Key

// Now each search + page has its own cache:

// students:list:name=jon:page=2:limit=10


// Without this → cache corruption.

// ✅ 2. Proper Pagination

// Now using:

// .skip(skip)
// .limit(limit)

// ✅ 3. Version-based ETag (Best Design)

// Instead of hashing full data (heavy),
// you use:

// "students-v-3"


// Much faster.

// 🚀 Production Level Improvement (Next Step)

// If you want ultra-advanced:

// Add Vary: Accept-Encoding

// Use Promise.all for count + find

// Increment version automatically on POST/PUT/DELETE

// Example:

// await redis.incr("students:version");


// inside write APIs.

// 🎯 Interview-Level Architecture You Just Built

// You now have:

// L1 Cache (Memory)

// L2 Cache (Redis)

// DB fallback

// Version-based ETag

// Early 304 optimization

// Gzip compression

// Pagination

// Search

// This is already senior-level API design.




const redlock = new Redlock([redis], {
  retryCount: 3,
  retryDelay: 100,
  retryJitter: 50,
});


export const getUsersWithQuery = async (req, res) => {
  const rid = req.requestId;
  const requestStart = performance.now();
  const lockTTL = 5000;

  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const query = buildStudentQuery(req.query);

    const cacheKey = `students:query:${Buffer
      .from(JSON.stringify({ query, page, limit }))
      .toString("base64")}`;

    // -------- Version / ETag --------
    const version = (await redis.get("students:version")) || 1;
    const etag = `"students-v-${version}"`;

    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    // -------- L1 Cache --------
    const l1 = l1Cache.get(cacheKey);
    if (l1) return sendResponse(res, l1, etag);

    // -------- L2 Cache (Redis) --------
    const redisData = await redis.get(cacheKey);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      l1Cache.set(cacheKey, parsed, 60);
      return sendResponse(res, parsed, etag);
    }

    // -------- Distributed Lock --------
    let finalData;

    try {
      const lock = await redlock.acquire([`locks:${cacheKey}`], lockTTL);

      try {
        // double check
        const again = await redis.get(cacheKey);
        if (again) {
          finalData = JSON.parse(again);
        } else {

          // 🔥 Fetch limit + 1 for hasMore
          const users = await mongoBreaker.fire({
            query,
            skip,
            limit: limit + 1
          });

          let hasMore = false;

          if (users.length > limit) {
            hasMore = true;
            users.pop();
          }

          finalData = {
            page,
            limit,
            hasMore,
            count: users.length,
            data: users
          };

          const ttl = 300 + Math.floor(Math.random() * 60);

          await redis.set(cacheKey, JSON.stringify(finalData), "EX", ttl);
          l1Cache.set(cacheKey, finalData, 60);
        }
      } finally {
        await lock.release();
      }
    } catch {
      // 🔥 Stale-While-Revalidate fallback
      const stale = await redis.get(cacheKey) || l1Cache.get(cacheKey);

      if (stale) finalData = JSON.parse(stale);
      else
        finalData = {
          page,
          limit,
          hasMore: false,
          count: 0,
          data: []
        };
    }

    return sendResponse(res, finalData, etag);

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
