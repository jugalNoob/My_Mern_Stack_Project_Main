import { getRedisStats } from "./Redis_Monitorning.js";

export const redisStats = async (req, res) => {

  try {

    const stats = await getRedisStats();

    return res.json({
      success: true,
      data: stats
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Unable to get Redis stats"
    });

  }
};

// For example, your API can return:

// {
//   "success": true,
//   "data": {
//     "keys": 152,
//     "memory": {
//       "usedBytes": 5242880,
//       "usedMB": 5,
//       "peakBytes": 7340032,
//       "peakMB": 7
//     }
//   }
// }
// If you also want to track your cache keys

// You can track how many keys your application creates:

// const keyCount = await redis.dbsize();

// console.log("Redis Keys:", keyCount);

// And memory:

// const memory = await redis.info("memory");

// console.log(memory);

// For your L1 NodeCache + L2 Redis setup, dbsize() tracks the Redis database keys, while INFO memory tracks Redis's memory consumption.