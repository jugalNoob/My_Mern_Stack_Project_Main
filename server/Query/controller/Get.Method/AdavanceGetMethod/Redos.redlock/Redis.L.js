import Redlock from "redlock";
import  redis from "../../../../../Conifg/redis.connect/connect.js";

export const redlock = new Redlock([redis], {
  retryCount: 3,
  retryDelay: 100,
  retryJitter: 50,
});
