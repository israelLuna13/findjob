import { DataTypes } from "sequelize";

import db from '../config/dba.js'
const Language = db.define('languages',{
    
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    }
});
export default Language;