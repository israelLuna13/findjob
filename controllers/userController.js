import {check,validationResult} from 'express-validator'
import User from '../models/User.js'
import {generarId} from '../helpers/tokens.js'

export class AuthController {

    static formLogin=(req,res)=>{
        res.render('auth/loginUser',{
            pagina:'Loign'
        })
    }
    static formRegister=(req,res)=>{
        res.render('auth/registerUser',{
            pagina:'Crear cuenta'
        })
    }
    static formForgotPassword=(req,res)=>{
        res.render('auth/forgotPasswordUser',{
            pagina:'Change password'
        })
    }

    static register = async(req,res)=>{
        await check('name').notEmpty().withMessage('El nombre es obligatorio').run(req)
        await check('email').isEmail().withMessage('Escriba un email valido').run(req)
        await check('password').isLength({min:6}).withMessage('El password debe ser de al menos 6 caracteres').run(req)
        await check('repit_password').equals(req.body.password).withMessage('El password no coincide').run(req)

        //result
        let result = validationResult(req)
        if(!result.isEmpty()){
            //errores
            return res.render('auth/registerUser',{
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
        return res.render('auth/registerUser',{
            pagina:'Create one',
            errores:[{msg:'The user existe in databse'}],
            user:{
                name:req.body.name,
                email:req.body.email
            }
        })}

        await User.create({
            name,
            email,
            password,
            token:generarId()
        })

        res.render('templates/message',{
            page:'Account created successfuly',
            message:'We have sent email to confirm account, touch link'
        })

    

    }
}
