import { DataTypes } from "sequelize";
import db from '../config/dba.js'

const Category = db.define('categorys',{
    
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    }
});
export default Category;