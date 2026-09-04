
import { useEffect, useState } from "react";
import "./redis_css.css";

function RedisDashboard() {
  const [redis, setRedis] = useState(null);
  const [error, setError] = useState("");

  const getRedis = async () => {
    try {
      const response = await fetch("https://my-mern-stack-project-main.onrender.com/redis");

      if (!response.ok) {
        throw new Error("API Error");
      }

      const result = await response.json();

      setRedis(result.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Redis API not connected");
    }
  };

  useEffect(() => {
    getRedis();

    const timer = setInterval(() => {
      getRedis();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  if (!redis) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="container">

      <h1>Redis Dashboard</h1>

      <p className="connected">
        🟢 Redis Connected
      </p>

      <div className="cards">

        <div className="card">
          <h3>Total Keys</h3>
          <h1>{redis.keys}</h1>
        </div>

        <div className="card">
          <h3>Used Memory</h3>
          <h1>
            {redis.memory.usedMB.toFixed(2)} MB
          </h1>
        </div>

        <div className="card">
          <h3>Peak Memory</h3>
          <h1>
            {redis.memory.peakMB.toFixed(2)} MB
          </h1>
        </div>

      </div>

      <div className="server">

        <h2>Redis Server</h2>

        <p>
          <b>Version:</b>{" "}
          {redis.server?.version || "N/A"}
        </p>

        <p>
          <b>Mode:</b>{" "}
          {redis.server?.mode || "N/A"}
        </p>

        <p>
          <b>Port:</b>{" "}
          {redis.server?.port || "N/A"}
        </p>

        <p>
          <b>Uptime:</b>{" "}
          {redis.server?.uptimeSeconds || 0} seconds
        </p>

      </div>

      <button className="refresh-btn" onClick={getRedis}>
        Refresh
      </button>

    </div>
  );
}

export default RedisDashboard;

