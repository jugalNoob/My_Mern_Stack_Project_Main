import zlib from "node:zlib";
import { RegisterGet} from "../../Model/Student.js";
import redis from "../../../Conifg/redis.connect/connect.js";

import l1Cache from "../../../Conifg/node.cache/node.cache.js";

import {  buildStudentQuery } from "./AdavanceGetMethod/Quary.Separate/Search.Quary.js";

import  { mongoBreaker } from '../../../Conifg/db.Circuit/db.CircuitBreaker.js'


import { performance } from "perf_hooks";

import {sendResponse} from './AdavanceGetMethod/Zip.Etag/Zip.js'

/// My matrice Logger Very Important ---------------------->>
 import logger from "../../monontring/window.log.js";

// this is My red Lock  ----------------------->>
import { redlock } from "../Get.Method/AdavanceGetMethod/Redos.redlock/Redis.L.js";


///Important Etag ------------------->>

import {generateETag} from '../Get.Method/AdavanceGetMethod/Zip.Etag/Etag.js'


///Import two layer of cache Important ------------------>>

import { getCache, setCache } from '../Get.Method/AdavanceGetMethod/Cache.Layer/Layer.js'


// Import jitter Very important --------------


import {cacheTTL} from './AdavanceGetMethod/Cache.Layer/Jitter/jitter.js'


export const getUsersWithQuery = async (req, res) => {
  const rid = req.requestId;
  const requestStart = performance.now();
  const lockTTL = 5000;

  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

      //  // ✅ Bloom check 
      //   if (!bloom.mightContain(`user:${userId}`)) {
      //     return res.status(404).json({ message: "User not found" });
      //   }
    


    const query = buildStudentQuery(req.query);

    const cacheKey = `students:query:${Buffer
      .from(JSON.stringify({ query, page, limit }))
      .toString("base64")}`;


          //  -------- Cache warming // ----------------->>



          

    // -------- Version / ETag --------
    // const version = (await redis.get("students:version")) || 1;
    // const etag = `"students-v-${version}"`;

    // if (req.headers["if-none-match"] === etag) {
    //   return res.status(304).end();
    // }

    const etag = await generateETag(redis);

    if (req.headers["if-none-match"] === etag) {
      console.log('etga')
      return res.status(304).end();
    }




    // -------- Cache Check --------
const cached = await getCache(cacheKey);
if (cached) return sendResponse(res, cached, etag);




    
    



    // // -------- L1 Cache -------- ->>>>>>>>>>>>>>>>>>>>>>>>>>>
    // const l1 = l1Cache.get(cacheKey);
    // if (l1) return sendResponse(res, l1, etag);



    // // -------- L2 Cache (Redis) --------
    // const redisData = await redis.get(cacheKey);
    // if (redisData) {
    //   const parsed = JSON.parse(redisData);
    //   l1Cache.set(cacheKey, parsed, 60);
    //   return sendResponse(res, parsed, etag);
    // }

    // -------- Distributed Lock --------
    let finalData;

    try {
      const lock = await  redlock.acquire([`locks:${cacheKey}`], lockTTL);

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
console.log('hit db')
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


          //I am use cache Jitter Very important -------------------->>
          const ttl = cacheTTL(60); // 60 seconds base TTL

          // const ttl = 300 + Math.floor(Math.random() * 60);
await setCache(cacheKey, finalData, ttl);
          // await redis.set(cacheKey, JSON.stringify(finalData), "EX", ttl);
          // l1Cache.set(cacheKey, finalData, 60);
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

//------------->>

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