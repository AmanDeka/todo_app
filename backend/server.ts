import express,{Request,Response} from 'express';
import dotenv from 'dotenv';
import path from 'path';
import expressSession from 'express-session';
import authroutes from './routes/authroutes';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';


const app = express()
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());




app.use(express.static("D:/WebDev/task_tracker/frontend/build"))

app.use('/auth',authroutes);


app.get('/',(req:Request,res:Response)=>{
    res.sendFile('D:/WebDev/task_tracker/frontend/build/index.html');
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});