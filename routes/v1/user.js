const express = require('express');


const { registraUsuario, login } = require('../../controller/v1/user');

const router = express.Router();

router.post('/login', login)

router.post('/',registraUsuario);

module.exports = router;