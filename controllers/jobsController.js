export class jobsController{
    static admin = (req,res)=>{
        res.render('jobs/admin',{
            page:'Vy Vacancies',
            barra:true
        })
    }
    static create = (req,res)=>{
        res.render('jobs/create',{
            page:'Create job',
            barra:true
        })
    }
}