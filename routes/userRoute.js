import express from "express"
import { AuthController } from "../controllers/userController.js";
const router = express.Router();

//routes
//login
router.get('/login',AuthController.formLogin)
router.post('/login',AuthController.autenticateUser)
//register
router.get('/register',AuthController.formRegister)
router.post('/register',AuthController.register)
//token
router.get('/confirm/:token',AuthController.confirm)
//reset password
router.get('/change-password',AuthController.formForgotPassword)
router.post('/change-password',AuthController.resetPassword)
router.get('/change-password/:token',AuthController.checkToken)
router.post('/change-password/:token',AuthController.newPassword)

export default router
