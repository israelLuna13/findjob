import { DataTypes } from "sequelize";
import db from "../config/dba.js";

const Message = db.define('messages',{
    message:{
        type:DataTypes.STRING(200),
        allowNull:true
    }
})

export default Message;