import express from 'express'
import {get_user} from '../controller/get/get.users.js'
 
export const router=express.Router()

router.get('/' , get_user)
