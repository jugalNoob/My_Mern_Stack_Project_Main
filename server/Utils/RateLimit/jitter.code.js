// utils/cacheTTL.js

/**
 * Returns a TTL with ±20% jitter
 * @param {number} baseTTL - base TTL in seconds
 * @returns {number} TTL with jitter
 */
export function cacheTTL(baseTTL) {
  const jitter = baseTTL * 0.2; // 20% variation
  return Math.floor(baseTTL - jitter + Math.random() * (jitter * 2));
}



