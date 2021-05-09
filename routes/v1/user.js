const express = require('express');
const bcrypt = require('bcrypt');

const UserSchema = require('../../models/UserSchema');
const validaRut = require('../../helpers/valida_rut');
const validaNombre = require('../../helpers/valida-nombre');
const validaEmail = require('../../helpers/valida_email');
const validaPassword = require('../../helpers/valida_password');

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

        if(!validaRut(rut)){
            return res.status(400).json({
                msj: 'Rut invalido'
            });
        }else{
            if (!validaNombre(nombre)){
                return res.status(400).json(
                    {
                        msj: 'Nombre invalido'
                    }
                )
            }else{
                if (!validaNombre(apepat)){
                    return res.status(400).json(
                        {
                            msj: 'Apellido paterno invalido'
                        }
                    )
                }else{
                    if (!validaNombre(apemat)){
                        return res.status(400).json(
                            {
                                msj: 'Apellido materno invalido'
                            }
                        )
                    }else{
                        if(!validaEmail(email)){
                            return res.status(400).json(
                                {
                                    msj: 'Email invalido'
                                }
                            )
                        }else{
                            if (!validaPassword(password)){
                                return res.status(400).json(
                                    {
                                        msj: 'Password invalido'
                                    }
                                )
                            }else{
                                const userDoc = UserSchema({
                                    rut,
                                    nombre,
                                    apellidoPat: apepat,
                                    apellidoMat: apemat,
                                    email,
                                    password
                                });
                                userDoc.save();
                                return res.json({
                                    msj: 'Usuario creado',
                                    data: userDoc
                                })
                            }
                        }
                    }
                }
            }
        }
        

        
    }catch(e){
        res.status(500).json(e);
    }
    



})

module.exports = router;