// import { Job, User } from "../models/index.js"

// export class ProfileController{
//     static showProfile=async(req,res)=>{
//         const {id} = req.params

//         if(id != req.user.id){
//             return res.redirect("/my-jobs")
//         }
//         const [user,total] = await Promise.all([
//             User.findByPk(id),

//             Job.count({
//                 where:{
//                     userId:id
//                 }
//             })
//         ])

//         //let totalMessage = 0

//         if(total != 0)


//     }
// }