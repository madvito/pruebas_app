const bcrypt = require('bcrypt');
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
module.exports = {
    registraUsuario
}