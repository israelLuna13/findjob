import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const protectRute = async(req,resizeBy,next)=>{
    //check is there is token

    const {_token} = req.cookies;
    if(!_token)
    {
        return resizeBy.redirect('/auth/login')
    }

    //check token
    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);

        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user){
            req.user=user
        }else{
            return res.redirect('/auth/login')
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default protectRute;