import NodeCache from "node-cache";

// Optional: default TTL for keys
const defaultTTL = 60; // seconds

const l1Cache = new NodeCache({
  stdTTL: defaultTTL, // can be overridden per key
  checkperiod: 60     // check every 60 seconds
});

export default l1Cache;

// module.exports = l1Cache;


// 👉 Super fast, in-process
// 👉 Clears automatically when app restarts