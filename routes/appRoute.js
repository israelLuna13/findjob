import express from 'express'
import { AppController } from '../controllers/appController.js'
const router = express.Router()

//home
router.get('/',AppController.home)
router.get('/categorys/:id',AppController.categorys)
router.get('/404',AppController.notFound)
router.post('/search',AppController.search)

export default router