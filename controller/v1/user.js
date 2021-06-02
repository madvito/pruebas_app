const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validaNombre = require("../../helpers/valida-nombre");
const validaEmail = require("../../helpers/valida_email");
const validaPassword = require("../../helpers/valida_password");
const validaRut = require("../../helpers/valida_rut");
const UserModel = require("../../models/UserModel");

const registraUsuario = async (req, res, next)=>{
    try{
        const {rut, nombre, apepat, apemat, email, password} = req.body;
        console.log(rut, nombre, apepat, apemat, email, password)

        if(!validaRut(rut)){
            console.log('err validarut');
            return res.status(400).json({
                msj: 'Rut invalido'
            });
        }
        console.log('rut validado')
        if (!validaNombre(nombre)){
            console.log('err validanombre');
            return res.status(400).json(
                {
                    msj: 'Nombre invalido'
                }
            )
        }
        console.log('nombre validado')
        if (!validaNombre(apepat)){
            console.log('err validaapepat');
            return res.status(400).json(
                {
                    msj: 'Apellido paterno invalido'
                }
            )
        }
        console.log('apepat validado')
        if (!validaNombre(apemat)){
            console.log('err validaapemat');
            return res.status(400).json(
                {
                    msj: 'Apellido materno invalido'
                }
            )
        }
        console.log('apemat validado')
        if(!validaEmail(email)){
            console.log('err validaemail');
            return res.status(400).json(
                {
                    msj: 'Email invalido'
                }
            )
        }
        console.log('email validado')
        if (!validaPassword(password)){
            console.log('err validapassword');
            return res.status(400).json(
                {
                    msj: 'Password invalido'
                }
            )
        }
        console.log('entro');
        const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.PASSWORD_SALT));
        console.log('pass lista')
        const userDoc = UserModel({
            rut,
            nombre,
            apellidoPat: apepat,
            apellidoMat: apemat,
            email,
            password: hashedPassword
        });
        const savedUser = await userDoc.save();
        console.log('savedUser',savedUser)
        
        return res.status(201).json({
            msj: 'Usuario creado',
            data: userDoc
        })
                            
    }catch(e){
        // res.status(500).json(e);
        e.statusCode = 500;
        next(e)
    }
}

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        console.log('email:',email, 'password:', password);
        const userDoc = await UserModel.findOne({email:email});
        console.log(userDoc)
        if (!userDoc){
            const err = new Error('Acceso denegado.');
            err.statusCode = 401;
            return next (err);
        }else if (!bcrypt.compareSync(password, userDoc.password)){
            const err = new Error('Usuario o password incorrecto.');
            err.statusCode = 401;
            return next (err);
        }

        const token = jwt.sign({user: userDoc.nombre, role: userDoc.role},process.env.TOKEN_SECRET,{expiresIn: '1h'});

        return res.status(200).json({
            user: userDoc.nombre,
            role: userDoc.role,
            token
        })
    }catch(e){
        e.statuscode = 500;
        next(e);
    }
    
}
module.exports = {
    registraUsuario,
    login
}