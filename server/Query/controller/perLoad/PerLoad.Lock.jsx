Perfect question Jugal 🔥
Now we move into real distributed system thinking.

You’re asking:

const lock = await redis.set("lock:homepage", "1", "NX", "EX", 10);
if (!lock) return;


👉 How exactly to use this?

Let’s break it clearly.

🧠 Why We Need This Lock

When using:

Node Cluster

PM2

Kubernetes (multiple pods)

You might have:

Worker 1
Worker 2
Worker 3
Worker 4


If all 4 run preloadHomePage() at same time:

4 DB hits

4 cache writes

Waste CPU

Waste IO

We want:

Only ONE worker warms cache.

That’s what this Redis lock does.

This is same concept used by companies like:

Amazon

Netflix

🔥 What This Line Actually Does
await redis.set("lock:homepage", "1", "NX", "EX", 10);

NX → Only set if NOT exists
EX 10 → Expire after 10 seconds

So:

First worker → Lock created ✅

Other workers → Lock already exists ❌

Redis returns:

"OK" if lock acquired

null if not


export default async function preloadHomePage() {
  const lockKey = "lock:homepage";

  // Try to acquire lock
  const lock = await redis.set(lockKey, "1", "NX", "EX", 10);

  if (!lock) {
    console.log("⛔ Another worker is warming homepage");
    return;
  }

  try {
    const cacheKey = getHomeCacheKey();

    const exists = await redis.get(cacheKey);
    if (exists) {
      console.log("✅ Homepage already warm");
      return;
    }

    console.log("🔥 Warming homepage...");

    const users = await mongoBreaker.fire({
      query: {},
      skip: 0,
      limit: 11
    });

    const hasMore = users.length > 10;
    if (hasMore) users.pop();

    const finalData = {
      page: 1,
      limit: 10,
      hasMore,
      count: users.length,
      data: users
    };

    await redis.set(cacheKey, JSON.stringify(finalData), "EX", 300);
    l1Cache.set(cacheKey, finalData, 60);

    console.log("🔥 Homepage preloaded successfully");

  } catch (err) {
    console.error("Preload error:", err);
  }
}
