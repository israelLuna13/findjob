import db from '../config/dba.js'
import { DataTypes } from "sequelize";

const Skill = db.define('skills',{
    //debe recibir un arreglo de nombres
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    }
});
export default Skill;