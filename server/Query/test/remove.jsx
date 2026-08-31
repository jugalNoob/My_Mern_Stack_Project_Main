💎 Ideal Production Behavior For This Endpoint

With:

L1 cache

Redis

No Redlock

Proper indexing

You should see:

2000–4000 req/sec
p50 < 20ms
p99 < 100ms


On localhost.

🧠 Why Only 927 req/sec?

Because:

Redlock queueing

skip() pagination (Mongo cost)

countDocuments() (if still enabled)

Possibly no proper index on country/bloodGroup

If Mongo query is slow, first wave of requests wait ~700ms → that becomes p50.

🔥 Your System Design Rating Based On This Test

Caching architecture: 9/10
Locking strategy: 6/10 (overused)
Pagination strategy: 6/10
Index usage: Unknown but likely 5/10
Performance tuning: 7/10

Overall production readiness: 7.5/10

Very strong foundation though 💪

🎯 What I Recommend You Do Now
Step 1

Remove Redlock temporarily → benchmark again

Step 2

Remove countDocuments → benchmark again

Step 3

Replace skip() with cursor → benchmark again

Step 4

Run cluster mode (4 workers)

Then compare.

If you want, next I can:

Simulate expected performance after removing Redlock

Or deeply analyze your Mongo query plan

Or explain why 14500 was your cluster limit earlier