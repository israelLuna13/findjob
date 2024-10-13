import Job from "./Job.js";
import Skill from "./Skills.js";
import Category from "./Category.js"
import Price from "./Price.js";
import User from "./User.js"

Job.belongsTo(Price,{foreignKey:'priceId'})
Job.belongsTo(Category,{foreignKey:'categoryId'})
Job.belongsTo(Skill,{foreignKey:'skillId'})
Job.belongsTo(User,{foreignKey:'userId'})

export{
    Job,
    User,
    Category,
    Price,
    Skill
}