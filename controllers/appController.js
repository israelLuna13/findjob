import { Category, Job, Price, Skill } from "../models/index.js"
import { Sequelize } from "sequelize"

export class AppController{
    static home = async(req,res)=>{
        // const min = 1;
        // const max = 5;
        // const random = Math.floor(Math.random() *(max - min + 1)) + min;
        const[categorys,prices,skills,jobs] = await Promise.all([
            Category.findAll({raw:true}),
            Price.findAll({raw:true}),
            Skill.findAll({raw:true}),

            Job.findAll({
                limit:6,
                // where:{
                //     categoryId:random
                // },
                include:[
                    {model:Price,as:'price'},
                    {model:Skill,as:'skill'},
                ],
                //order by date
                order:[['createdAt','DESC']]
            }),

        ])
        let userInSession
        (req.user != null ? userInSession = true: userInSession = false)

        res.render('home',{
            page:'Home',
            categorys,
            prices,
            skills,
            jobs,
            csrfToken:req.csrfToken(),
            userInSession

        })

    }
    static categorys = async(req,res)=>{
        const {id} = req.params

        const category=await Category.findByPk(id)

        if(!category)
            return res.redirect('/404')
        const jobs = await Job.findAll({
            where:{
                categoryId:id
            },
            include:[
                {model:Price,as:'price'},
                {model:Skill,as:'skill'},
            ]
        })

        res.render('category',{
            page:`${category.name}`,
            jobs,
            csrfToken:req.csrfToken()
        })
        

    }
    static notFound = async(req,res)=>{

        res.render('404',{
            page:'Not found',
            csrfToken:req.csrfToken()

        })

    }
    static search = async(req,res)=>{
        const {termino} = req.body

        if(!termino.trim())
            return res,redirect('back')
        //search job by name of search
        const jobs = await Job.findAll({
            where:{
                title:{
                    [Sequelize.Op.like]:`%${termino}%`
                }
            },
            include:[
                {model:Price,as:'price'},
                {model:Skill,as:'skill'},
            ]
        })
        res.render('search',{
            page:'Results of search',
            jobs,
            csrfToken:req.csrfToken()

        })

    }
}