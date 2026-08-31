import redis from "../../Redis/redisClient.js";

export const idempotencyMiddleware = async (req, res, next) => {
  let key = req.headers["idempotency-key"];

  // Auto-generate if missing
  if (!key) {
    key = crypto.randomUUID();
    req.headers["idempotency-key"] = key;
  }

  req.idempotencyKey = key;

  // Check Redis
  const cachedResponse = await redis.get(`idempotency:${key}`);
  if (cachedResponse) {
    console.log("✅ Returning cached response for key", key);
    return res.status(200).json(JSON.parse(cachedResponse));
  }

  // Hook res.json to store response in Redis
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    // Save in Redis for 1 hour (3600 seconds)
    await redis.set(`idempotency:${key}`, JSON.stringify(body), "EX", 3600);
    return originalJson(body);
  };

  next();
};
