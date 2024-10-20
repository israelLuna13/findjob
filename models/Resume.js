import { DataTypes } from "sequelize";
import db from "../config/dba.js";

const Resume = db.define('resumes',{
    resume:{
        type:DataTypes.STRING,
        allowNull:true
    }
})

export default Resume;