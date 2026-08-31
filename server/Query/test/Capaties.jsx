🎯 What “DB Capacity” Actually Means

Database capacity is:

Max Queries Per Second (QPS)

Latency under load (P95 / P99)

CPU saturation point

IOPS limit (disk throughput)

Connection limits

Memory pressure

If any one of these maxes out → DB becomes bottleneck.

🧮 STEP 1 — Measure Single Query Cost

First, measure your query time without load.

Example:

User.find(query).skip(skip).limit(limit)


Test in Mongo shell:

db.users.find({ country: "Korea" }).limit(10).explain("executionStats")


Look at:

executionTimeMillis
totalDocsExamined
totalKeysExamined


If:

executionTimeMillis = 8ms


That means:

👉 1 query ≈ 8ms CPU time

🧠 STEP 2 — Theoretical Max QPS

Formula:

Max QPS ≈ 1000ms / avg_query_time


If query = 8ms

1000 / 8 = 125 QPS per CPU core


If DB has:

8 CPU cores


Then:

125 × 8 = 1000 QPS theoretical max


That is pure CPU-bound estimate.

🧮 STEP 3 — Apply Realistic Efficiency Factor

Databases never run at 100%.

Apply 60% rule:

1000 × 0.6 = 600 QPS safe


So safe DB capacity:

~600 QPS

🚨 Important: API RPS ≠ DB QPS

If:

Cache hit ratio = 80%

Only 20% go to DB

Then:

If API gets 5000 RPS

DB only gets:

5000 × 0.2 = 1000 QPS


Now check:

If DB safe = 600 QPS
But incoming = 1000 QPS

👉 DB will bottleneck.

🧪 STEP 4 — Load Test DB Directly

Real companies do this:

Use load tools to hit DB only.

In Mongo:

mongostat
mongotop


Watch:

CPU %

QPS

Scan and order

Page faults

Connections

If CPU hits 80%+ → you reached limit.

📊 STEP 5 — Disk IOPS Calculation

If query is not fully indexed:

Mongo must read disk.

Check:

totalDocsExamined >> nReturned


Example:

Examined: 10,000
Returned: 10


That is bad index usage.

Disk IOPS becomes bottleneck.

🧠 STEP 6 — Memory Calculation

MongoDB uses RAM heavily.

If working set fits in RAM:

Performance = stable

If RAM overflow:

Performance collapses (disk thrashing)

Rule:

Working dataset < 70% of RAM


Example:

DB size: 8GB

RAM: 16GB

Good

But:

DB size: 40GB

RAM: 16GB

Bad → disk reads explode

🏗 STEP 7 — Connection Pool Limits

Each Node worker creates connections.

If:

8 workers

poolSize = 50

Total connections:

8 × 50 = 400


Mongo default limit ≈ 500–1000.

Too many → context switching overhead.

🔥 Real Production DB Capacity Planning Formula
DB Capacity =

(min of)

CPU capacity
IOPS capacity
Memory working set fit
Connection saturation
Lock contention


Whichever hits first is your limit.

📈 Real Example (Your Case)

Let’s assume:

Query time: 10ms

8 cores

60% safe rule

1000/10 = 100 QPS per core
100 × 8 = 800 QPS
800 × 0.6 = 480 QPS safe


So DB safe:

~500 QPS


If cache hit ratio = 80%

Then max API RPS:

500 / 0.2 = 2500 RPS


That is your true system ceiling.

Even if Node can do 7000 RPS.

DB becomes bottleneck.

🎯 Why Big Companies Use Replication

They scale reads by:

Primary for writes

Secondary replicas for reads

With 3 replicas:

Read capacity ≈ 3 × single instance


This is how large systems scale.

🧠 Advanced: Lock Contention

If many writes happen:

Mongo lock contention increases.

You must measure:

wiredTiger concurrent transactions


High contention → performance drop.

🏁 How YOU Should Scientifically Measure

Disable cache

Load test DB-heavy endpoint

Monitor CPU, RAM, IOPS

Increase load until:

P95 > 2× baseline

CPU > 80%

That is your DB max QPS

Apply 70% rule

Design around it

🔥 Senior-Level Thinking

The system is only as strong as its weakest layer:

Node

Redis

Mongo

Network

You must capacity-plan each layer separately.