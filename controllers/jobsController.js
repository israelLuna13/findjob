
import {Price,Category,Job,Skill} from '../models/index.js'

import { validationResult } from "express-validator"
export class jobsController{
    static admin = async(req,res)=>{
        const {id} = req.user
        const jobs = await Job.findAll({
            where:{
                userId:id
            },
            include:[
                {model:Category,as:'category'},
                {model:Price,as:'price'},
                {model:Skill,as:'skill'}
            ]
        })
       
        res.render('jobs/admin',{
            page:'My Jobs',
            jobs
        })
    }
    static  create = async(req,res)=>{
        const [categorys,skills,prices] = await Promise.all([
            Category.findAll(),
            Skill.findAll(),
            Price.findAll(),
        ])
        console.log(skills);
        
        res.render('jobs/create',{
            csrfToken:req.csrfToken(),
            data:{},
            page:'Create job',
            categorys,
            skills,
            prices

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
            console.log(skills);


            return res.render('jobs/create',{
                page:'Create job',
                csrfToken:req.csrfToken(),
                categorys,
                prices,
                skills,
                errores:result.array(),
                data:req.body
            })
        }

        //all well
        const {title,description,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body

        const {id:userId} = req.user
        

        try {
            
            const jobSaved = await Job.create({
                title,
                description,
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
                const {title,description,company,calle,lat,lng,category:categoryId,price:priceId,skill:skillId}= req.body

                
                    job.set({
                    title,
                    description,
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
    
}