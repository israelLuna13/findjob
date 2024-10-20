import Job from "./Job.js";
import Skill from "./Skills.js";
import Category from "./Category.js"
import Price from "./Price.js";
import User from "./User.js"
import Resume from "./Resume.js";
import Message from "./Message.js";

Job.belongsTo(Price,{foreignKey:'priceId'})
Job.belongsTo(Category,{foreignKey:'categoryId'})
Job.belongsTo(Skill,{foreignKey:'skillId'})
Job.belongsTo(User,{foreignKey:'userId'})

Job.hasMany(Resume,{foreignKey:'jobId',as:'resumes'})
Job.hasMany(Message,{foreignKey:'jobId',as:'messages'})

Resume.belongsTo(Job,{foreignKey:'jobId'})
Resume.belongsTo(User,{foreignKey:'userId'})

Message.belongsTo(Job,{foreignKey:'jobId'})
Message.belongsTo(User,{foreignKey:'userId'})

export{
    Job,
    User,
    Category,
    Price,
    Skill,
    Resume,
    Message
}