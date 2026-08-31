export const createShutdownHandler = ({ server, redisClient, mongoose }) => {
  return async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      try {
        if (redisClient) {
          await redisClient.quit();
          console.log("Redis closed");
        }

        if (mongoose) {
          await mongoose.connection.close();
          console.log("MongoDB closed");
        }

        console.log("HTTP server closed");
        process.exit(0);

      } catch (error) {
        console.error("Shutdown error:", error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error("Force shutdown triggered");
      process.exit(1);
    }, 10000);
  };
};
