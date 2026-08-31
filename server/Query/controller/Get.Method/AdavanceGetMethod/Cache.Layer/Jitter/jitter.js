export function cacheTTL(baseTTL, minJitter = 0.1, maxJitter = 0.2, log = false) {
  const jitterPercent = minJitter + Math.random() * (maxJitter - minJitter);
  const jitterAmount = baseTTL * jitterPercent;
  const finalTTL = Math.floor(baseTTL - jitterAmount + Math.random() * jitterAmount * 2);
  
  if (log) console.log(`cacheTTL -> base: ${baseTTL}s, final: ${finalTTL}s, jitter: ${Math.round(jitterPercent*100)}%`);
  
  return finalTTL;
}
