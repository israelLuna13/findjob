import express from 'express'
import userRoutes from './routes/userRoute.js'
import db from './config/dba.js'
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

const app = express()

//enable read data on forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//config middleware to process the data of the request http
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//enable cookieparser
app.use(cookieParser())
//enable csrf
app.use(csurf({cookie:true}))
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
app.use('/auth',userRoutes)

//port and start project
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`The server is working on port ${port}`);
})