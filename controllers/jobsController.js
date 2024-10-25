
import {Price,Category,Job,Skill, Message, User, Resume, Shift, Language} from '../models/index.js'
import { validationResult } from "express-validator"
import { formatearFecha, isEmployer } from '../helpers/index.js'
import { resumeUpload } from '../helpers/emails.js'
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
                total

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
            languages

        })
    }
    static addResume = async(req,res)=>{
        const {id} = req.params
        // const {id:idUser} = req.user
        // let aplicated = false
        // const resume = await Resume.findByPk(idUser)
        const job = await Job.findByPk(id)

        // if(idUser == resume.userId && id == resume.jobId){
        //     aplicated = true

        // }
       
        
        if(!job){
            return res.redirect('my-jobs')
        }

        if(!job.published){
            return res.redirect('/my-jobs')
        }
        
        // if(req.user.id.toString() !== job.userId.toString()){
        //     return res.redirect('/my-jobs')
        // }
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
                {model:User,as:'user'}
            ]
        })
        if(!job)
            return res.redirect('/my-jobs')
        
        // if(job.published)
        //     return res.redirect('/my-jobs')
        // console.log("SI ESTA PUBLICADO");
        
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
             
            next()
        } catch (error) {
            console.log(error);
        }
    }

    //arreglar : insertar id del lenguage del trabajo y del tipo de trabajo
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

        //all well
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
           // const {id} = jobSaved

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

        console.log(job);
        

        res.render('jobs/edit',{
            page:`Edit ${job.title}`,
            csrfToken:req.csrfToken(),
            categorys,
            prices,
            skills,
            data:job,
            languages,
            shifts
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
               // const {id} = jobSaved
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
            if(resume){
                if(idUser == resume.userId && id == resume.jobId){
                    aplicated = true
                }
            }
            
           

            if(!job || !job.published){
                return res.redirect('/404')
            }    
            let userInSession
            (req.user != null ? userInSession = true: userInSession = false)
            
            res.render('jobs/show',{
                job,
                page:job.title,
                csrfToken:req.csrfToken(),
                user:req.user,
                isEmployer:isEmployer(req.user?.id,job.userId),
                userInSession,
                aplicated
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
                        model:Resume,
                        as:'resumes',
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
            console.log(res.user);
            
            if(job.userId.toString() !== req.user.id.toString())
                return res.redirect("/my-jobs")
            
            job.published =!job.published
            await job.save()
             res.json({
                result:true
             })

        }
}