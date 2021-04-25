const express = require('express');
const bcrypt = require('bcrypt');

const UserSchema = require('../../models/UserSchema');

const router = express.Router();

router.get('/',(req,res)=>{
    console.log('get users');
    res.json({
        msj: 'get users'
    })
})

router.post('/',(req,res)=>{
    try{
        const {rut, nombre, apepat, apemat, email, password} = req.body;
        console.log(rut, nombre, apepat, apemat, email, password)
        console.log('create user');

        const userDoc = UserSchema({
            rut,
            nombre,
            apellidoPat: apepat,
            apellidoMat: apemat,
            email,
            password
        });
        userDoc.save();
        res.json({
            msj: 'create user'
        })
    }catch(e){
        res.status(500).json(e);
    }
    



})

module.exports = router;