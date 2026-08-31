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





function randomTTL(baseTTL, minJitter = 0.1, maxJitter = 0.2) {

    // Step 1: random jitter percentage
    let jitterPercent = minJitter + Math.random() * (maxJitter - minJitter);

    // Step 2: calculate jitter value
    let jitter = baseTTL * jitterPercent;

    // Step 3: randomize between (baseTTL - jitter) and (baseTTL + jitter)
    let result = Math.floor(baseTTL - jitter + Math.random() * (2 * jitter));

    return result;
}

