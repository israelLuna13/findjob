import express from 'express'
import {jobsController} from '../controllers/jobsController.js'
import { body } from 'express-validator'
import protectRute from '../middleware/protecRute.js'
const router = express.Router()

router.get('/my-jobs',protectRute,jobsController.admin)
router.get('/jobs/create',protectRute,jobsController.create)
router.post('/jobs/create',protectRute,
    body('title').notEmpty().withMessage('The title is required'),
    body('description').notEmpty().withMessage('The description is required'),
    body('category').notEmpty().withMessage('Choose category'),
    body('price').notEmpty().withMessage('Choose price'),
    body('lat').notEmpty().withMessage('Choose direction'),
    body('skill').isArray({ min: 1 }).withMessage('Choose at least one skill'),    
    body('skill.*').notEmpty().withMessage('Invalid skill selection'),
    jobsController.save)
router.get('/jobs/edit/:id',protectRute,jobsController.edit)
router.post('/jobs/edit/:id',protectRute,
    body('title').notEmpty().withMessage('The title is required'),
    body('description').notEmpty().withMessage('The description is required'),
    body('category').notEmpty().withMessage('Choose category'),
    body('price').notEmpty().withMessage('Choose price'),
    body('lat').notEmpty().withMessage('Choose direction'),
    body('skill').isArray({ min: 1 }).withMessage('Choose at least one skill'),    
    body('skill.*').notEmpty().withMessage('Invalid skill selection',
        ),jobsController.saveChanges

)

export default router