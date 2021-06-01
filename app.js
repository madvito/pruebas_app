const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

// set env
require('dotenv').config({path: `${__dirname}/.env.${process.env.NODE_ENV}`});
console.log('NODE_ENV',process.env.NODE_ENV);

const app = express();
app.use(express.json());

app.use(router);

//ERROR HANDLER
app.use((err,req,res,next)=>{
    console.log('handler', err);

    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;

    res.status(status).json({
        message,
        data
    });
})

const SERVER_PORT = process.env.SERVER_PORT;

// mongoose.connect('mongodb://localhost:27017/pruebas_app',
mongoose.connect(process.env.DB_URL,
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
},()=>{
    app.listen(SERVER_PORT, ()=>{
        console.log(`Listening http:localhost:${SERVER_PORT}`);
    });
});
