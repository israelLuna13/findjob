import express from "express"
import { AuthController } from "../controllers/userController.js";
const router = express.Router();

//routes
router.get('/login',AuthController.formLogin)
router.get('/register',AuthController.formRegister)
router.post('/register',AuthController.register)
router.get('/change-password',AuthController.formForgotPassword)
export default router
