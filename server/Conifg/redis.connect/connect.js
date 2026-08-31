import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
};

// Main client
const redisClient = new Redis(redisConfig);

// Publisher
export const redisPub = new Redis(redisConfig);

// Subscriber
export const redisSub = new Redis(redisConfig);

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