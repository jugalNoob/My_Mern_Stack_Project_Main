import  redis from '../../../../../Conifg/redis.connect/connect.js'
import l1Cache from "../../../../../Conifg/node.cache/node.cache.js";

export const getCache = async (key) => {
  // 🔥 Check L1 (Memory)
  const l1 = l1Cache.get(key);
  console.log('lay1')
  if (l1) {
    return l1;
  }

  // 🔥 Check L2 (Redis)
  const redisData = await redis.get(key);
  if (redisData) {
    const parsed = JSON.parse(redisData);
console.log('layer 2')
    // Promote to L1
    l1Cache.set(key, parsed);

    return parsed;
  }

  return null;
};

export const setCache = async (key, value, ttl = 300) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);

  // Also update L1
  l1Cache.set(key, value);
};
