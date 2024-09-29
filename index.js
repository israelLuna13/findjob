import express from 'express'
import userRoutes from './routes/userRoute.js'
import db from './config/dba.js'

const app = express()

//enable read data on forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//connect database
try {
    await db.authenticate();
    console.log('Connected successfully database');
    
} catch (error) {
    console.log(error);
}

//enable pug
app.set('view engine','pug');
app.set('views','./views');

//public folder
app.use(express.static('public'))

//routing
app.use('/user',userRoutes)

//port and start project
const port = 3000

app.listen(port,()=>{
    console.log(`The server is working on port ${port}`);
})