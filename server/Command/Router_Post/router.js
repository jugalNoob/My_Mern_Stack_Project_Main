import express from 'express'
import { createUser } from '../controller.command/services/post.js'

export const router = express.Router()

router.post('/postuser', createUser)