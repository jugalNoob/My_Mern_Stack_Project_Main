import redisClient from "../../../Conifg/redis.connect/connect.js";
export const getRedisStats = async () => {
  try {
    const keyCount = await redisClient.dbsize();

    const memory = await redisClient.info("memory");
    const server = await redisClient.info("server");

    const usedMemory =
      Number(memory.match(/used_memory:(\d+)/)?.[1] || 0);

    const peakMemory =
      Number(memory.match(/used_memory_peak:(\d+)/)?.[1] || 0);

    const redisVersion =
      server.match(/redis_version:([^\r\n]+)/)?.[1];

    const mode =
      server.match(/redis_mode:([^\r\n]+)/)?.[1];

    const port =
      Number(server.match(/tcp_port:(\d+)/)?.[1] || 0);

    const uptime =
      Number(server.match(/uptime_in_seconds:(\d+)/)?.[1] || 0);

    return {
      keys: keyCount,

      memory: {
        usedBytes: usedMemory,
        usedMB: usedMemory / 1024 / 1024,

        peakBytes: peakMemory,
        peakMB: peakMemory / 1024 / 1024,
      },

      server: {
        version: redisVersion,
        mode,
        port,
        uptimeSeconds: uptime,
      },
    };

  } catch (error) {
    console.error("Redis stats error:", error);
    throw error;
  }
};