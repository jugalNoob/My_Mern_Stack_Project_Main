// // middleware/rateLimiter.js
// const { cacheTTL } = require('../utils/cacheTTL');
// const redisClient = require('../config/redis'); // your Redis client instance


import redisClient from '../../Conifg/redis.connect/connect.js';

import { cacheTTL} from '../RateLimit/jitter.code.js'

/**
 * Rate limiter middleware
 * @param {object} options - configuration
 * @param {number} options.limit - max requests per window
 * @param {number} options.window - base window in seconds
 */
export  const rateLimiter = ({ } = {}) => {


  return async (req, res, next) => {

    try {
      const key = `rate:${req.ip}`;
      let limit=100
      let window=600
      // Increment counter
      const current = await redisClient.incr(key);

      // Set TTL with jitter if first request
      if (current === 1) {
        const ttl = cacheTTL(window);
        await redisClient.expire(key, ttl);
        console.log(`TTL for ${key}: ${ttl}s`);
      }

      // Check if over limit
      if (current > limit) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests',
        });
      }

      next();
    } catch (err) {
      console.error('Rate limiter error:', err);
      next(); // fail open if Redis fails
    }
  };
};


