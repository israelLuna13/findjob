
import {Price,Category,Job,Skill} from '../models/index.js'
import { shifts,languages } from '../Data/localData.js'
import { validationResult } from "express-validator"
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
                        {model:Skill,as:'skill'}
                    ]
                }),

                Job.count({
                    where:{
                        userId:id
                    }
                })
            ])

            console.log(jobs);
            
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

        const [categorys,skills,prices] = await Promise.all([
            Category.findAll(),
            Skill.findAll(),
            Price.findAll(),
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

    static  save = async(req,res)=>
    {
        let result = validationResult(req)
        if(!result.isEmpty()){
            const [categorys,prices,skills] = await Promise.all([
                Category.findAll(),
                Price.findAll(),
                Skill.findAll()
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
        const {title,description,benefit,shift,language,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body

        const {id:userId} = req.user
        

        try {
            
            const jobSaved = await Job.create({
                title,
                description,
                benefit,
                shift,
                language,
                company,
                calle,
                lat,
                lng,
                categoryId,
                priceId,
                skillId,
                userId,
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
        const job = await Job.findByPk(id)

        if(!job){
            return res.redirect('/my-jobs')
        }
        if(job.userId.toString() !== req.user.id.toString()){
            return res.redirect('/my-jobs')
        }

        const [categorys,prices,skills] = await Promise.all([
            Category.findAll(),
            Price.findAll(),
            Skill.findAll()
        ]);
        console.log(job);

        res.render('jobs/edit',{
            page:`Edit ${job.title}`,
            csrfToken:req.csrfToken(),
            categorys,
            prices,
            skills
            ,data:job
        })
    }

    static  saveChanges = async(req,res)=>
        {
            let result = validationResult(req)
            if(!result.isEmpty()){
                const [categorys,prices,skills] = await Promise.all([
                    Category.findAll(),
                    Price.findAll(),
                    Skill.findAll()
                ]);
                console.log(skills);

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
                const {title,description,benefit,shift,language,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body

                
                    job.set({
                    title,
                    description,
                    benefit,
                    shift,
                    language,
                    company,
                    calle,
                    lat,
                    lng,
                    categoryId,
                    priceId,
                    skillId
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
            console.log(job);
            

            res.render('jobs/show',{
                job,
                page:job.title
            })


        }
}