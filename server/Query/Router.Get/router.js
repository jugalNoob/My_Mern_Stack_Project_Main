import express from 'express'
import { getUsersWithQuery  } from '../../Query/controller/Get.Method/Adavance.Get.method.js'
import {getsearch } from '../../Query/controller/Aggregation_Analysis/Get.js'
export const router = express.Router()

router.get('/get',  getUsersWithQuery )
router.get('/analyseapi' , getsearch)