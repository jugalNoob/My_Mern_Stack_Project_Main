import express from 'express'
// import {askAgent } from './Ai.Agents/Airun/CallAi.js';
import {connectMongo} from './db/conne.js'
// import  redisClient from './Config/redis/redis.js'
import {router} from './routes/router.js'


const app=express()
app.use(express.json());

await connectMongo()

app.use(router)
const port=9000


app.listen(port , ()=>{
    console.log(port)
})