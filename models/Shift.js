import { DataTypes } from "sequelize";

import db from '../config/dba.js'
const Shift = db.define('shifts',{
    
    name:{
        type:DataTypes.STRING(30),
        allowNull:false
    }
});
export default Shift;