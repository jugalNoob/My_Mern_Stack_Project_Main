import { createClient } from "redis";

// 🔥 Main Redis client (for DB, cache, zset, etc.)
const redisClient = createClient();

// 🔥 Publisher client
export const redisPub = createClient();

// 🔥 Subscriber client
export const redisSub = createClient();

const connectRedis = async () => {
  try {
    await redisClient.connect();
    await redisPub.connect();
    await redisSub.connect();

    console.log("✅ Redis Connected (client + pub + sub)");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};

connectRedis();

// error handling
redisClient.on("error", (err) => console.error("Redis error:", err));
redisPub.on("error", (err) => console.error("Redis pub error:", err));
redisSub.on("error", (err) => console.error("Redis sub error:", err));

export default redisClient;
