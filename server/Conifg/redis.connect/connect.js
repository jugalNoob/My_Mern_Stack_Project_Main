import Redis from "ioredis";

const redisUrl =
  process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Main client
const redisClient = new Redis(redisUrl);

// Publisher
export const redisPub = new Redis(redisUrl);

// Subscriber
export const redisSub = new Redis(redisUrl);

// Connection logs
redisClient.on("connect", () => {
  console.log("✅ Redis Main Connected");
});

redisPub.on("connect", () => {
  console.log("✅ Redis Publisher Connected");
});

redisSub.on("connect", () => {
  console.log("✅ Redis Subscriber Connected");
});

// Error handling
redisClient.on("error", (err) => {
  console.error("❌ Redis Main Error:", err.message);
});

redisPub.on("error", (err) => {
  console.error("❌ Redis Pub Error:", err.message);
});

redisSub.on("error", (err) => {
  console.error("❌ Redis Sub Error:", err.message);
});

export default redisClient;