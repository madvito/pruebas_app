const express = require('express');


const { registraUsuario } = require('../../controller/v1/user');

const router = express.Router();

router.get('/',(req,res)=>{
    console.log('get users');
    res.json({
        msj: 'get users'
    })
})

router.post('/',registraUsuario);

module.exports = router;