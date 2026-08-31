npm install -g autocannon

autocannon --version


3️⃣ Your Cluster App (PID visible)

Make sure you have this route:

app.get('/home', (req, res) => {
  res.send(`Handled by PID ${process.pid}`);
});


Start your cluster:

node cluster.js


Example output:

Primary 1120 running
Worker 1123 started
Worker 1124 started
Worker 1125 started

4️⃣ Basic Autocannon Test
autocannon http://localhost:3000/home

Output (example)
Running 10s test @ http://localhost:3000/home
10 connections

Stat         Avg      Stdev     Max
Latency (ms) 12.4     3.1       80
Req/Sec      820      40        900

5️⃣ Cluster Test (High Load)
autocannon -c 100 -d 10 http://localhost:3000/home


| Flag     | Meaning                |
| -------- | ---------------------- |
| `-c 100` | 100 concurrent clients |
| `-d 10`  | 10 seconds duration    |




6️⃣ REAL Cluster Proof (PID distribution)

Run:

autocannon -c 50 -d 10 http://localhost:3000/home


Watch your server logs:

[PID 1123] GET /home
[PID 1125] GET /home
[PID 1124] GET /home
[PID 1123] GET /home


✔ Requests spread across workers
✔ Cluster load balancing confirmed

7️⃣ Advanced Test (Heavy Traffic)
autocannon -c 500 -d 15 http://localhost:3000/home


Expected:

CPU usage ↑

All workers busy

Single-process Node would struggle

8️⃣ JSON Result (For Analysis)
autocannon -c 200 -d 10 -j http://localhost:3000/home


Outputs JSON:

{
  "requests": { "average": 9200 },
  "latency": { "average": 14.3 }
}


Useful for:

Charts

CI pipelines

System design proofs

9️⃣ Compare: Single Process vs Cluster
Single Node process
Req/sec ~ 2,000
CPU 100%

Cluster (4 cores)
Req/sec ~ 7,000–8,000
CPU evenly distributed


💡 This is WHY cluster exists.

10️⃣ Pro Tip: Autocannon from Code (optional)
import autocannon from 'autocannon';

autocannon({
  url: 'http://localhost:3000/home',
  connections: 100,
  duration: 10
});

✅ Summary

✔ Autocannon stresses your server
✔ Confirms cluster is working
✔ Shows real performance gains
✔ Interview-ready topic