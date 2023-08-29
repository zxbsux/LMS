import cookieParser from 'cookie-parser';
import express from'express';
import morgan from 'morgan';
import cors from 'cors'
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:[process.env.FROTENT_URL],
    Credential:true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/saurav',(req,res)=>{
    res.send('hello world');
});
app.use('/api/user',userRoutes)
app.use('*',(req,res)=>{
    res.status(400).send('opps 404 error occur')
});
app.use(errorMiddleware);


export default app;