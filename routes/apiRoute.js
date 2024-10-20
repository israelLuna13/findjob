import express from 'express'
import { APiController } from '../controllers/apiController.js'
const router = express.Router()

router.get('/jobs',APiController.jobs)

export default router