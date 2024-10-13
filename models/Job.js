import { DataTypes } from "sequelize";
import db from '../config/dba.js'

const Job = db.define('jobs',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    
    title:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    calle:{
        type:DataTypes.STRING,
        allowNull:false
      },
      lat:{
        type:DataTypes.STRING,
        allowNull:false
      },
      lng:{
        type:DataTypes.STRING,
        allowNull:false
      },
      published:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
      }

});
export default Job;