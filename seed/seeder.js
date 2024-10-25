import categorys from "./category.js";
import skills from "./skills.js";
import prices from "./price.js";
import user from "./user.js";
import db from '../config/dba.js'
import {Skill,Category,Price,User,Language,Shift} from "../models/index.js"
import shifts from "./shift.js";
import languages from "./language.js";

const importarDatos= async ()=>{
    try{
        //Autenticar
        await db.authenticate()
        //generar las columnas
        await db.sync()
        //insertar los datos al mismo tiempo
        await Promise.all([
            Category.bulkCreate(categorys),
            Price.bulkCreate(prices),
            Skill.bulkCreate(skills),
            User.bulkCreate(user),
            Shift.bulkCreate(shifts),
            Language.bulkCreate(languages),

        ]);
        console.log('Datos Importados Correctamente');
        process.exit();// terminar los procesos pero no hubo errores 
    }catch(error){
        console.log(error);
        process.exit(1); // terminar los procesos pero hubo un error
    }
}
const eliminarDatos = async() => {
    try{
        //eliminamos los datos con destroy 
        //reiniciamos el contador de id con truncate
        // await Promise.all([
        //     Categoria.destroy({where:{},truncate:true}),
        //     Precio.destroy({where:{},truncate:true})
        // ]);
        await db.sync({force:true});
        console.log('Datos eliminados correctamente');
        process.exit();
    }catch(error){
        console.log(error);
        process.exit(1); // terminar los procesos pero hubo un error
    }
}
if(process.argv[2] === "-i"){
    importarDatos();
}
if(process.argv[2] === "-e"){
    eliminarDatos();
}