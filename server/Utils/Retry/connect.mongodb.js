
// 🔁 Jitter
function jitter(base, attempt, max) {
  const delay = Math.min(base * 2 ** attempt, max);
  return Math.floor(Math.random() * delay);
}

// 🔁 Retry Logic
 export async function retryConnect(fn, retries = 10, base = 500, max = 5000) {

  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔁 DB Connect Attempt ${i + 1}`);
      return await fn();
    } catch (err) {
      console.error("❌ Connection failed:", err.message);

      if (i === retries - 1) throw err;

      const delay = jitter(base, i, max);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}