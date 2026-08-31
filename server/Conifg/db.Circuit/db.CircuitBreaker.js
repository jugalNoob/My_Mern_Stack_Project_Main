import CircuitBreaker from "opossum";
import {RegisterGet } from "../../Query/Model/Student.js";
import {retryConnect} from '../../Utils/Retry/mongodb.retry.js'



// const mongoQuery = async ({ query = {}, skip=0, limit = 10 } = {}) => {
//     console.log("🔥 mongoQuery received:", { skip, limit });
//   return await RegisterGet.find(query)
//     .sort({ _id: 1 })   // ✅ MUST HAVE
//     .skip(skip)
//     .limit(limit + 1)
//     .lean();
// };

import mongoose from "mongoose";

const mongoQuery = async ({ query = {}, skip = 0, limit = 10 } = {}) => {
  // ❌ Remove this block — connectMongo() is awaited before queries run
  // if (mongoose.connection.readyState !== 1) {
  //   throw new Error("MongoDB not connected yet");
  // }

  return await RegisterGet.find(query)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .lean();
};




const retryMongoQuery = retryConnect(mongoQuery, 3, 500, 5000);

// const retryMongoQuery =  retryConnect(mongoQuery, 500, 3, 5000);




const options = {
  timeout: 3000,                // fail if query >3s
  errorThresholdPercentage: 50, // open circuit if 50% failures
  resetTimeout: 10000,           // try again after 10s
  rollingCountBuckets: 10,       // internal failure tracking
  rollingCountTimeout: 10000     // 10s window
};




// const retryMongoQuery = retryConnect(mongoQuery, 3, 500, 5000);

// export const mongoBreaker = new CircuitBreaker(
//   async (params) => {
//     console.log("📦 breaker received:", params); // ✅ DEBUG
//     return await retryMongoQuery(params);        // ✅ FORCE PASS
//   },
//   options
// );



export const mongoBreaker = new CircuitBreaker(
  retryMongoQuery,   // ✅ MUST pass retry function
  options
);


// ✅ Fallback when MongoDB is unavailable
mongoBreaker.fallback(() => ({
  message: "DB temporarily unavailable",
  data: [],
  fallback: true
}));


// -------------------------
// Event listeners for failure-awareness
// -------------------------





// Fires on every failure
mongoBreaker.on("failure", (err) => {
  console.error("❌ Mongo query failed:", err.message);
  // Optional: send metrics to monitoring service like Prometheus, Datadog
});

// Fires when circuit opens (too many failures)
mongoBreaker.on("open", () => {
  console.warn("🚨 Circuit OPEN - MongoDB is failing, fallback activated");
});

// Fires when circuit goes half-open (testing recovery)
mongoBreaker.on("halfOpen", () => {
  console.warn("⚠️ Circuit HALF-OPEN - Testing MongoDB recovery");
});

// Fires when circuit closes (MongoDB healthy)
mongoBreaker.on("close", () => {
  console.log("✅ Circuit CLOSED - MongoDB recovered");
});

// Fires on timeout
mongoBreaker.on("timeout", () => {
  console.error("⏱️ Mongo query timed out");
});
