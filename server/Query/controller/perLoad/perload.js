import redis from "../../../Conifg/redis.connect/connect.js";
import l1Cache from "../../../Conifg/node.cache/node.cache.js";
import { mongoBreaker } from "../../../Conifg/db.Circuit/db.CircuitBreaker.js";

function getHomeCacheKey() {
  const base = {
    query: {},
    page: 1,
    limit: 10
  };

  return `students:query:${Buffer
    .from(JSON.stringify(base))
    .toString("base64")}`;
}




export default async function preloadHomePage() {
  const cacheKey = getHomeCacheKey();

  const exists = await redis.get(cacheKey);
  if (exists) {
    console.log("✅ Homepage already warm");
    return;
  }

  console.log("🔥 Warming homepage...");

  const users = await mongoBreaker.fire({
    query: {},
    skip: 0,
    limit: 11
  });

  const hasMore = users.length > 10;
  if (hasMore) users.pop();

  const finalData = {
    page: 1,
    limit: 10,
    hasMore,
    count: users.length,
    data: users
  };

  console.log(users)

  await redis.set(cacheKey, JSON.stringify(finalData), "EX", 300);
  l1Cache.set(cacheKey, finalData, 60);

  console.log("🔥 Homepage preloaded successfully");
}

