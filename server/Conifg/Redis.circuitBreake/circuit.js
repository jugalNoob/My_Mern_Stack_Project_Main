// redisCircuit.js
import redis from "./redisClient.js";
import CircuitBreaker from "opossum";

// Example: wrapping a Redis GET operation
async function redisGet(key) {
  return redis.get(key);
}

async function redisSet(key, value, ttl = 3600) {
  return redis.set(key, value, "EX", ttl);
}

// Circuit breaker options
const options = {
  timeout: 3000, // If Redis call takes >3s, consider it failed
  errorThresholdPercentage: 50, // Breaker opens if >50% of requests fail
  resetTimeout: 5000, // Try again after 5s
};

// Create breakers
export const getBreaker = new CircuitBreaker(redisGet, options);
export const setBreaker = new CircuitBreaker(redisSet, options);

// Optional: handle breaker events
[getBreaker, setBreaker].forEach((breaker) => {
  breaker.on("open", () => console.warn("⚠️ Circuit breaker opened"));
  breaker.on("halfOpen", () => console.info("🔄 Circuit breaker half-open"));
  breaker.on("close", () => console.info("✅ Circuit breaker closed"));
  breaker.on("fallback", (data) => console.warn("Fallback triggered", data));
});

// Example fallback (optional)
getBreaker.fallback((key) => {
  console.warn("Returning fallback for key", key);
  return null;
});
