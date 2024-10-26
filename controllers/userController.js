import {check,validationResult} from 'express-validator'
import User from '../models/User.js'
import {generarId,generarJWT} from '../helpers/tokens.js'
import { emailForgotPassword, registerEmail } from '../helpers/emails.js'
import bcrypt from 'bcrypt'

export class AuthController {

    static formLogin=(req,res)=>{
        if(!req.user)
        {
            res.render('auth/user-login',{
                csrfToken:req.csrfToken(),
                page:'Login'
            })
        }
        res.redirect('/my-jobs')
    }
    static autenticateUser=async(req,res)=>{
        await check("email")
            .isEmail()
            .withMessage("Email is required")
            .run(req);
        await check("password")
            .notEmpty()
            .withMessage("Password is required")
            .run(req);

        let result= validationResult(req);

        if (!result.isEmpty()) {
              //errores
              return res.render("auth/user-login", {
                page: "Login",
                csrfToken:req.csrfToken(),
                errores: result.array(),  
              });
            }
        //find user
        const {email,password}=req.body
        const user = await User.findOne({where:{email}})
        if(!user){
            return res.render("auth/user-login",{
                page:"Login",
                csrfToken:req.csrfToken(),
                errores:[{msg:'The User does not exist '}]
            })
        }
        //
        if(!user.confirmado){
            return res.render("auth/user-login",{
                page:"Login",
                csrfToken:req.csrfToken(),
                 errores:[{msg:'The user does not has been confirm'}]
            })
        }

        //check password
        if(!user.checkPassword(password)){
            return res.render("auth/user-login",{
                page:'Login',
                csrfToken:req.csrfToken(),
                errores:[{msg:'Password incorrect'}]
            })
        }
        //token will be created with the user is id and name
        const token = generarJWT({id:user.id,name:user.name})
        //redirect 
        return res.cookie('_token',token,{
            httpOnly:true
        }).redirect('/my-jobs')
    }
    static formRegister=(req,res)=>{
        if(!req.user)
        {
            res.render('auth/user-register',{
                page:'Crate account',
                csrfToken:req.csrfToken()
            })
        }
        res.redirect('/my-jobs')
        
    }
    static formForgotPassword=(req,res)=>{
        res.render('auth/user-recover-password',{
            csrfToken:req.csrfToken(),
            page:'Change password'
        })
    }
//-----------------
    static logout=(req,res)=>{
        return res.clearCookie('_token').status(200).redirect('/auth/login')
    }

    static register = async(req,res)=>{
        await check('name').notEmpty().withMessage('Name is required').run(req)
        await check('email').isEmail().withMessage('Write email correct').run(req)
        await check('password').isLength({min:6}).withMessage('The password must be at least 6 characters long.').run(req)
        await check('repit_password').equals(req.body.password).withMessage('El password no coincide').run(req)

        //result
        let result = validationResult(req)
        if(!result.isEmpty()){
            //errores
            return res.render('auth/user-register',{
                pagina:'Create account',
                errores:result.array(),
                name:{
                    name:req.body.name,
                    email:req.body.email
                }
            })
        }
        const {email,name,password} = req.body
        //Check if user exist in database
    const existeUsuario =   await User.findOne({where:{email}})
    if(existeUsuario)
    {
        return res.render('auth/user-register',{
            page:'Create one',
            csrfToken:req.csrfToken(),
            errores:[{msg:'The user existe in databse'}],
            user:{
                name:req.body.name,
                email:req.body.email
            }
        })}

        const user=await User.create({
            name,
            email,
            password,
            token:generarId()
        })
        

        //send email
        registerEmail({
            name:user.name,
            email:user.email,
            token:user.token

        })
        res.render("templates/message", {
            page: "Account created sussessfully",
            message: "We have sent a email confirmation",
          });
    }

    static confirm = async(req,res)=>{

        const {token} = req.params
    //ckeck token
    const user = await User.findOne({where:{token}})
    if(!user)
    {
        return res.render('auth/user-confirm-account',{
            page:'Error confirming account',
            message:'Try again, error confirming account',
            error:true
        })
    }
    //confirm account

    user.token=null
    user.confirmado=true

    await user.save()
    res.render('auth/user-confirm-account',{
        page:'Account confirmed',
        message:'Account confirmed successfully'
    })
    }

    static resetPassword=async(req,res)=>{
        await check("email")
        .isEmail()
        .withMessage("Write email correct")
        .run(req);
        
        let result = validationResult(req)

        if(!result.isEmpty()){
            return res.render("auth/user-recover-password",{
                page: "Recover your account",
                csrfToken:req.csrfToken(),
                errores:result.array()  
            })
        }

        //search user
        const {email}=req.body
        const user = await User.findOne({where:{email}})
        if(!user){
            res.render("auth/user-recover-password", {
              pagina: "Recover your account",
              csrfToken:req.csrfToken(),
              errores:[{msg:'The email does not exist'}]
            });
        }

        //create token and send email
        user.token =generarId()
        await user.save()

        //send email
        emailForgotPassword({
            email:user.email,
            name:user.name,
            token:user.token
        })
        
        res.render("templates/message",{
            page:"Change your password",
            message:"We have sent email about instructions"
        })
    }

    static checkToken = async(req,res)=>{
        const {token} = req.params
        //search the user with that token
        const user = await User.findOne({where:{token}})
        if(!user)
        {
            return res.render('auth/user-confirm-account',{
                page:'Change your password',
                message:'There was an error validating your informationl please try again',
                error:true
            })
        }
        res.render('auth/user-reset-password',{
            page:'Change your password',
            csrfToken:req.csrfToken()
        })
    }

    static  newPassword=async(req,res)=>{
        await check("password")
            .isLength({ min: 6 })
            .withMessage("The password most be at least 6 characters long")
            .run(req);
        let result = validationResult(req)

        if(!result.isEmpty()){
            return res.render("auth/user-reset-password",{
                page: "Change your account",
                csrfToken:req.csrfToken(),
                errores: result.array(),
            })
        }
        const {token}=req.params
        const {password}=req.body

        const user = await User.findOne({where:{token}})

        //hash new password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)

        //delete token when change the password
        user.token=null
        await user.save()
        res.render('auth/user-confirm-account',{
            page:'Password changed',
            message:'Password saved successfully'
        })
    }
}
