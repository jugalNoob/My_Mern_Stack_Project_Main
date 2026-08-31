import cluster from "node:cluster";
import os from "node:os";
import mongoose from "mongoose";

import { connectMongo } from "../../Conifg/Mongodb.connect/db.js";
import redisClient from "../../Conifg/redis.connect/connect.js";

// const numCPUs = os.cpus().length;

 const numCPUs = 1;
const port = process.env.PORT || 9000;

if (cluster.isPrimary) {

  console.log(`Primary ${process.pid} running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }



    cluster.on("exit", (worker, code) => {

  console.log(`Worker ${worker.process.pid} died`);

  if (code !== 0) {

    setTimeout(() => {
      cluster.fork();
    }, 5000);

  }

});



} else {

  startWorker();

}

async function startWorker() {

  try {

    await connectMongo();

    console.log("✅ Mongo Connected");

    // 🔥 import AFTER connection
    const { default: app } = await import("../../app.js");

    const server = app.listen(port, () => {

      console.log(
        `Worker ${process.pid} running on ${port}`
      );

    });

    const shutdown = async () => {

      console.log(`Worker ${process.pid} shutting down`);

      server.close();

      await mongoose.connection.close();

      await redisClient.quit();

      process.exit(0);

    };

    process.on("SIGINT", shutdown);

    process.on("SIGTERM", shutdown);

  } catch (err) {

    console.error(err);

    process.exit(1);

  }

}