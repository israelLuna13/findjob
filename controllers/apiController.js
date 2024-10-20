import {Category, Job, Price, Skill} from '../models/index.js'
export class APiController {
    static jobs = async(req,res)=>{
        const jobs = await Job.findAll({
            include:[
                {model:Price, as:'price'},
                {model:Skill, as:'skill'},
                {model:Category, as:'category'}
            ]
        })

        res.json(jobs)
    }
}