const express=require('express');
const PORT=require('./Config/config').PORT;
const connection=require('./Utils/connection');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const FRONTEND_URL=require('./Config/config').FRONTEND_URL;

const app=express();
app.use(express.json());
app.use(cors({
    origin:FRONTEND_URL,
    methods:['GET','POST','PUT','DELETE',],
    allowedHeaders:[
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials:true
}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.listen(PORT,()=>{
    connection();
    console.log(`PORT Connected @ ${PORT}`);
})