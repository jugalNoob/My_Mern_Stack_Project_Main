

// 🔁 Jitter
function jitter(base, attempt, max) {
  const delay = Math.min(base * 2 ** attempt, max);
  return Math.floor(Math.random() * delay);
}



export function retryConnect(fn, retries = 3, base = 500, max = 5000) {
  return async function (...args) {   // ✅ return function
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔁 Attempt ${i + 1}`);
        console.log("📥 retry args:", args);

        return await fn(...args);     // ✅ pass args
      } catch (err) {
        console.error("❌ Retry error:", err.message);

        if (i === retries - 1) throw err;

         const delay = jitter(base, i, max);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      }
    }
  };
}
