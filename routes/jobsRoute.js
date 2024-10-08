import express from 'express'
import {jobsController} from '../controllers/jobsController.js'
const router = express.Router()

router.get('/my-jobs',jobsController.admin)
router.get('/jobs/create',jobsController.create)

export default router