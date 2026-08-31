import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { router } from './Query/Router.Get/router.js';

import { rateLimiter } from "./Utils/RateLimit/Ratelimit.js";
import { errorMiddleware } from "./Utils/GlobalError/error.js";
import { corsOptions } from "./Utils/CORS/cors.js";

const app = express();

app.use(cors(corsOptions));

app.use(rateLimiter());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorMiddleware);

global.isMongoReady = true;
app.use((req,res,next)=>{

   if(!global.isMongoReady){

      return res.status(503).json({
         message:"Server warming up"
      });

   }

   next();

});

export default app;