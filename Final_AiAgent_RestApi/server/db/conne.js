// import CircuitBreaker from "opossum";
import mongoose from "mongoose";
// import {retryConnect} from '../utlis/retry/retryFnDb_Connect.js'

export const connectMongo = async () => {

    const MONGO_URI = 'mongodb+srv://jugal786:jugal786@cluster0.sgg8t.mongodb.net/ones?retryWrites=true&w=majority';


  try {
   
      mongoose.connect(MONGO_URI, {
           maxPoolSize: 50,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      monitorCommands: true,
      })
   

    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("💥 DB connection failed, exiting...");
    process.exit(1); // 🔥 important
  }
};
