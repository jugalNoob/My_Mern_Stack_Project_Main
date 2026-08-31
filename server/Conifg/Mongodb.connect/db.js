import mongoose from "mongoose";
import  { retryConnect } from '../../Utils/Retry/connect.mongodb.js'



export const connectMongo = async () => {
  const MONGO_URI =process.env.MONGO_URL
console.log(MONGO_URI)
  console.log("Mongo URI exists:", !!process.env.MONGO_URL);
  try {

     await retryConnect(() =>
mongoose.connect( MONGO_URI , {
      maxPoolSize: 50,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000
    })

        );
    console.log("✅ Mongo Connected");

  } catch (err) {

    console.error("Mongo connection failed:", err);

    process.exit(1);

  }

};



mongoose.connection.on("connected", () => {
  console.log("Mongo connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongo disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongo error", err);
});





