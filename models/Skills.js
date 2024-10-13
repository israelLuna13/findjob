import db from '../config/dba.js'
import { DataTypes } from "sequelize";

const Skill = db.define('skills',{
    
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    }
});
export default Skill;