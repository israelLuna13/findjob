
import {Price,Category,Job,Skill, Message, User, Resume, Shift, Language} from '../models/index.js'
import { validationResult } from "express-validator"
import { formatearFecha, isEmployer } from '../helpers/index.js'
import { resumeUpload } from '../helpers/emails.js'
import { col, fn } from "sequelize";

export class jobsController{
    static admin = async(req,res)=>{
        //query string
         const {page:currentPage} = req.query
        //regular expresion
          const regex = /^[0-9]$/
          // if the expresion it is not true
          if(!regex .test(currentPage)){
            return res.redirect('/my-jobs?page=1')
          }
          try {
            const {id} = req.user
            const limit = 5 // jobs by page
            const offset = (currentPage * limit) - limit 
            const [jobs,total] = await Promise.all([
                Job.findAll({
                    limit,
                    offset,
                    where:{
                        userId:id
                    },
                    include:[
                        {model:Category,as:'category'},
                        {model:Price,as:'price'},
                        {model:Skill,as:'skill'},
                        {model:Language,as:'language'},
                        {model:Shift,as:'shift'},
                        {model:Resume,as:'resumes'},
                    ]
                }),

                Job.count({
                    where:{
                        userId:id
                    }
                })
            ])            
            res.render('jobs/admin',{
                page:'My jobs',
                jobs,
                csrfToken:req.csrfToken(),
                pages:Math.ceil(total/limit),
                currentPage:Number(currentPage),
                offset,
                limit,
                total,
                id

            })
          } catch (error) {
            console.log(error);
            
          }
    }
    static  create = async(req,res)=>{

        const [categorys,skills,prices,languages,shifts] = await Promise.all([
            Category.findAll(),
            Skill.findAll(),
            Price.findAll(),
            Language.findAll(),
            Shift.findAll(),
        ])
        
        res.render('jobs/create',{
            csrfToken:req.csrfToken(),
            data:{},
            page:'Create job',
            categorys,
            skills,
            prices,
            shifts,
            languages,
            id:req.user.id

        })
    }
    static addResume = async(req,res)=>{
        const {id} = req.params
        const job = await Job.findByPk(id)

        if(!job)
            return res.redirect('my-jobs')

        if(!job.published)
            return res.redirect('/my-jobs')
        
        res.render('jobs/add-resume',{
            page:`Add resume at ${job.title}`,
            csrfToken:req.csrfToken(),
            job
        })
    }
    static saveResume=async(req,res,next)=>{
        const {id} = req.params
 
        const job = await Job.findByPk(id,{
            include:[
                {model:User.scope('deletePassword'),as:'user'}
            ]
        })
        if(!job)
            return res.redirect('/my-jobs')
        
        if(!job.published)
            return res.redirect('/my-jobs')
        
        try {
            const resume= req.file.filename
            const { id: jobId } = req.params;
            const { id: userId } = req.user;
            await Resume.create({
                resume,
                jobId,
                userId
             })

             const {title} = job
             const {name} = req.user
             const {email}=job.user
             const {name:employer} = job.user

            //sent email to employer
             resumeUpload({
                title,
                name,
                employer,
                email
            })
            next()//next middleware
        } catch (error) {
            console.log(error);
        }
    }
    static  save = async(req,res)=>
    {
        let result = validationResult(req)
        if(!result.isEmpty()){
            const [categorys,prices,skills,shifts,languages] = await Promise.all([
                Category.findAll(),
                Price.findAll(),
                Skill.findAll(),
                Shift.findAll(),
                Language.findAll(),
            ]);

            return res.render('jobs/create',{
                page:'Create job',
                csrfToken:req.csrfToken(),
                categorys,
                prices,
                skills,
                errores:result.array(),
                data:req.body,
                shifts,
                languages
            })
        }

        //all is good
        const {title,description,benefit,shift:shiftId,language:languageId,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body

        const {id:userId} = req.user
    
        try {
            
              await Job.create({
                title,
                description,
                benefit,
                company,
                calle,
                lat,
                lng,
                categoryId,
                priceId,
                skillId,
                userId,
                shiftId,
                languageId,
                published:true
            })
            res.redirect('/my-jobs')
        } catch (error) {
            console.log(error);   
        }
    }

    static edit = async (req,res)=>{
        const {id} = req.params
        const job = await Job.findByPk(id,{
            include:[
                {model:User,as:'user'},
                {model:Price,as:'price'},
                {model:Category,as:'category'},
                {model:Skill,as:'skill'},
                {model:Shift,as:'shift'},
                {model:Language,as:'language'},
            ]
        })        

        if(!job){
            return res.redirect('/my-jobs')
        }
        //if user in session is not the user that create the job
        if(job.userId.toString() !== req.user.id.toString()){
            return res.redirect('/my-jobs')
        }

        const [categorys,prices,skills,shifts,languages] = await Promise.all([
            Category.findAll(),
            Price.findAll(),
            Skill.findAll(),
            Shift.findAll(),
            Language.findAll(),
        ]);

        res.render('jobs/edit',{
            page:`Edit ${job.title}`,
            csrfToken:req.csrfToken(),
            categorys,
            prices,
            skills,
            data:job,
            languages,
            shifts,
            id:req.user.id
        })
    }

    static  saveChanges = async(req,res)=>
        {
            let result = validationResult(req)
            if(!result.isEmpty()){
                const [categorys,prices,skills,shifts,languages] = await Promise.all([
                    Category.findAll(),
                    Price.findAll(),
                    Skill.findAll(),
                    Shift.findAll(),
                    Language.findAll(),
                ]);

                return res.render('jobs/edit',{
                    page:'Edit job',
                    csrfToken:req.csrfToken(),
                    categorys,
                    prices,
                    skills,
                    languages,
                    shifts,
                    errores:result.array(),
                    data:req.body
                })
            }

            const {id} =req.params

            const job = await Job.findByPk(id)
            if(!job){
                return res.redirect('/my-jobs')
            }

            //if user in session is not the user that create the job
            if(job.userId.toString() !== req.user.id.toString()){
                return res.redirect('/my-jobs')
            }

            try {
                const {title,description,benefit,shift:shiftId,language:languageId,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body
                    job.set({
                    title,
                    description,
                    benefit,
                    company,
                    calle,
                    lat,
                    lng,
                    categoryId,
                    priceId,
                    skillId,
                    shiftId,
                    languageId
                })
                await job.save()
                res.redirect('/my-jobs')
            } catch (error) {
                console.log(error);   
            }
        }

        static delete = async(req,res)=>
        {
            const {id} = req.params
            const job = await Job.findByPk(id)

            if(!job)
            {
                return res.redirect('/my-jobs')
            }

            //if user in session is not the user that create the job
            if(job.userId.toString() !== req.user.id.toString()){
                return res.redirect('/my-jobs')
            }
            await job.destroy()
            res.redirect('/my-jobs')
        }

        static showJob = async(req,res)=>{
            const {id} = req.params
            const {id:idUser} = req.user
            let aplicated = false
            const resume = await Resume.findOne({
                where:{
                    jobId:id
                }
            })
            
            const job = await Job.findByPk(
                id,
                {
                    include:[
                        {model:Category,as:'category'},
                        {model:Price,as:'price'},
                        {model:Skill,as:'skill'},
                        {model:Shift,as:'shift'},
                        {model:Language,as:'language'},
                    ]
                }
            )
          //  If the user has already uploaded the resume to the job           
           if(resume){
                if(idUser == resume.userId && id == resume.jobId)
                    aplicated = true
            }
            
            if(!job || !job.published){
                return res.redirect('/404')
            }    
            let userInSession
            // if there is user in session
            (req.user != null ? userInSession = true: userInSession = false)
            
            res.render('jobs/show',{
                job,
                page:job.title,
                csrfToken:req.csrfToken(),
                user:req.user,
                isEmployer:isEmployer(req.user?.id,job.userId),
                userInSession,
                aplicated,
                id:req.user.id
            })
        }

        //este metodo va a apuntar a otra vista
        static sentMessage = async(req,res)=>{
            const {id} = req.params

            const job = await Job.findByPk(
                id,
                {
                    include:[
                        {model:Category,as:'category'},
                        {model:Price,as:'price'},
                        {model:Skill,as:'skill'}
                    ]
                }
            )
            if(!job){
                return res.redirect('/404')
            }
            let result = validationResult(req)
            if(!result.isEmpty())
            {
                return res.render("jobs/show",{
                    job,
                    page:job.title,
                    csrfToken: req.csrfToken(),
                    user:req.user,
                    isEmployer:isEmployer(req.user?.id,job.userId),
                    errores: result.array(),
                })
            }
            const { message } = req.body;
            const { id: jobId } = req.params;
            const { id: userId } = req.user;
             await Message.create({
                message,
                jobId,
                userId
             })
             res.redirect('/')
        }
        static lookMessage = async(req,res)=>{
            const {id} = req.params

            const job = await Job.findByPk(id,{
                include:[
                    {
                        model:Message,
                        as:'messages',
                        include:[{model:User.scope("deletePassword"),as:"user"}]
                    }
                ]
            })
            if(!job){
                return res.redirect('/my-jobs')
            }
            res.render("jobs/messages",{
                page:'Messages',
                message:job.messages,
                formatearFecha,
            })
        }

        static lookResumes=async(req,res)=>{
            const {id} = req.params

            const job = await Job.findByPk(id,{
                include:[
                    {
                        model:Resume,as:'resumes',
                        include:[{model:User.scope("deletePassword"),as:"user"}]
                    }
                ]
            })
            if(!job){
                return res.redirect('/my-jobs')
            }
            res.render("jobs/resumes",{
                page:'Resumes',
                resume:job.resumes,
                formatearFecha,
            })

        }
        
        static changeState = async(req,res)=>{
            const {id} = req.params
            const job = await Job.findByPk(id)

            if(!job)
                return res.redirect("/my-jobs")
            
            if(job.userId.toString() !== req.user.id.toString())
                return res.redirect("/my-jobs")
            
            job.published =!job.published
            await job.save()
             res.json({
                result:true
             })

        }

        //-------------profile
        static lookProfile =async (req,res)=>{
            const {id} = req.params 
            if(id != req.user.id)
                return res.redirect("/my-jobs")

            const [user,total] = await Promise.all([
                User.findByPk(id),
                Job.count({
                    where:{
                        userId:id
                    }
                })
            ])
  let totalMensajes = 0
  //si no hay cv 
  if(total != 0) // contamos los cv que tiene el usuario en sus jobs
  {
     const resumes =
     await Job.findAll({
      where: {
        userId:id // Filtramos las jobs por el ID del usuario
      },
      include: [
        {
          model: Resume,
          as: 'resumes',
          attributes: [] // No necesitamos los atributos de los cv
        }
      ],
      attributes: [
        [fn('COUNT',col('resumes.id')), 'resumes'] // Contamos los cv
      ],
      raw: true // Devuelve los datos en formato plano
    });
    totalMensajes = resumes[0].resumes
  }

            if(!user)
                return res.redirect("/my-jobs")

            const {name,email} = user
            return res.render("jobs/profile",{
                    name,
                    email,
                    id,
                    total,
                    totalMensajes,
                    csrfToken: req.csrfToken(),
                })
        }


        static showForm = async(req,res)=>{
            const {id} = req.params
            if(id != req.user.id)
                return res.redirect("/my-jobs")
            const user = await User.findByPk(id)
            if(!user)
                return res.redirect("/my-jobs")

            return res.render('jobs/formEdit',{
                csrfToken: req.csrfToken(),
                data:user,
                page:"Edit information"
            })
        }

        static editProfile=async(req,res)=>{
            const {id} = req.params
            if(id != req.user.id)
                return res.redirect("/my-jobs")

            let result = validationResult(req)
            if(!result.isEmpty()){
                return res.render('jobs/formEdit',{
                    csrfToken: req.csrfToken(),
                    id,
                    errores:result.array(),
                    page:'Edit information',
                    data:req.body
                })
            }

            const user = await User.findByPk(id)
            if(!user)
                return res.redirect('/my-jobs`')

            try {
                const {name:nameDb, email:emailDb,id} = user
                const {name,email} = req.body
                if(nameDb == name && emailDb == email)
                    return res.redirect(`/profile/${id}`)
                if(name != nameDb)
                    user.set({name})
                if(email != emailDb)
                    user.set({email})
                await user.save()
                res.redirect(`/profile/${id}`)
            } catch (error) {
                console.log(error);
                
            }
                
        }



}