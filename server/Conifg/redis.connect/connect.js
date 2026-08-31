import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);
console.log(process.env.REDIS_URL)
redisClient.on("connect", () => {
  console.log("✅ Successfully connected to Redis!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

export default redisClient;