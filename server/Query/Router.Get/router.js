import express from 'express'
import { getUsersWithQuery  } from '../../Query/controller/Get.Method/Adavance.Get.method.js'
import {getsearch } from '../../Query/controller/Aggregation_Analysis/Get.js'
import {aiagent} from '../../Query/controller/ai_agent/agent.js'
import {redisStats} from 
'../controller/redis_DashBorad/get_redis_DashBord.js'


export const router = express.Router()

router.get('/get',  getUsersWithQuery )
router.get('/analyseapi' , getsearch)
router.get('/ai' , aiagent)
// Redis get DashBorad 
router.get('/redis' , redisStats)


router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Latest backend is running"
  });
});