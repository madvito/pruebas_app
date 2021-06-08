const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const validaNombre = require("../../helpers/valida-nombre");
// const validaEmail = require("../../helpers/valida_email");
// const validaPassword = require("../../helpers/valida_password");
// const validaRut = require("../../helpers/valida_rut");
const {validaNombre,validaEmail,validaPassword,validaRut} = require("../../helpers/register_validators");
const UserModel = require("../../models/user_model");
const GradeModel = require("../../models/grade_model");

const registraUsuario = async (req, res, next)=>{
    try{
        const {rut, nombre, apepat, apemat, email, password, grade} = req.body;

        if(!validaRut(rut)){
            console.log('err validarut');

            const err = new Error('Rut invalido');
            err.statusCode = 400;
            throw(err);
        }
        console.log('rut validado')
        if (!validaNombre(nombre)){
            console.log('err validanombre');

            const err = new Error('Nombre invalido');
            err.statusCode = 400;
            throw(err);
        }
        console.log('nombre validado')
        if (!validaNombre(apepat)){
            console.log('err validaapepat');

            const err = new Error('Apellido paterno invalido');
            err.statusCode = 400;
            throw(err);
        }
        console.log('apepat validado')
        if (!validaNombre(apemat)){
            console.log('err validaapemat');

            const err = new Error('Apellido materno invalido');
            err.statusCode = 400;
            throw(err);
        }
        console.log('apemat validado')
        if(!validaEmail(email)){
            console.log('err validaemail');

            const err = new Error('Email invalido');
            err.statusCode = 400;
            throw(err);
        }
        console.log('email validado')
        if (!validaPassword(password)){
            console.log('err validapassword');

            const err = new Error('Password invalido');
            err.statusCode = 400;
            throw(err);
        }
        if(!grade){
            console.log('err curso');
            const err = new Error('Ingresar curso');
            err.statusCode = 400;
            throw err;
        }

        const gradeDoc = await GradeModel.findById(grade);
        if (!gradeDoc){
            console.log('err curso');
            const err = new Error('El curso no existe');
            err.statusCode = 400;
            throw err;
        }
        const {school_year} = gradeDoc;

        console.log('entro');
        const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.PASSWORD_SALT));
        console.log('pass lista');

        const dataToSave = {
            rut,
            nombre,
            apellidoPat: apepat,
            apellidoMat: apemat,
            email,
            password: hashedPassword,
            school_year: [school_year],
            grade: grade
        }

        const userDoc = UserModel(dataToSave);
        const savedUser = await userDoc.save();
        console.log('savedUser',savedUser)
        const payload = {
            rut: savedUser.rut,
            nombre: savedUser.nombre,
            apellidoPat: savedUser.apellidoPat,
            apellidoMat: savedUser.apellidoMat,
            email: savedUser.email,
            role: savedUser.role,
            school_year: savedUser.school_year,
            grade: grade
        }
        
        return res.status(201).json({
            message: 'Usuario creado correctamente',
            data: payload
        })
                            
    }catch(e){
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e)
    }
}

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            const err = new Error('Ingresar email y password');
            err.statusCode = 400;
            throw err;
        }
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

        const token = jwt.sign({user: userDoc._id, role: userDoc.role},process.env.TOKEN_SECRET,{expiresIn: process.env.TOKEN_EXPIRATION});

        return res.status(200).json({
            user: userDoc._id,
            nombre: `${userDoc.nombre} ${userDoc.apellidoPat}`,
            role: userDoc.role,
            token
        })
    }catch(e){
        if (!e.statusCode){
            e.statuscode = 500;
        }
        next(e);
    }
    
}
module.exports = {
    registraUsuario,
    login
}