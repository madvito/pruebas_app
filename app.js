const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(router);





const SERVER_PORT = process.env.SERVER_PORT;

mongoose.connect('mongodb://localhost:27017/pruebas_app', 
{useNewUrlParser: true, useUnifiedTopology: true},()=>{
    app.listen(SERVER_PORT, ()=>{
        console.log(`Listening http:localhost:${SERVER_PORT}`)
    });
});
