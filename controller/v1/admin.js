const bcrypt = require('bcrypt');

const {validaNombre,validaEmail,validaPassword,validaRut} = require("../../helpers/register_validators");
const UserModel = require("../../models/user_model");
const TeacherModel = require("../../models/teacher_model");
const SubjectModel = require("../../models/subject_model");
const GradeModel = require("../../models/grade_model");
const { Mongoose } = require('mongoose');

const addTeacher = async (req, res, next) => {
    
    const {rut, nombre, apepat, apemat, email, password, role, securityCode, subject, schoolYear} = req.body;
    console.log(rut, nombre, apepat, apemat, email, password, role, securityCode, subject, schoolYear);

    if (securityCode != process.env.TEACHER_CODE){
        console.log('err codigo profesor');
        const err = new Error('Código de seguridad invalido');
        err.statusCode = 401;
        throw err;
    }

    if(!validaRut(rut)){
        console.log('err validarut');
        // return res.status(400).json({
        //     msj: 'Rut invalido'
        // });
        const err = new Error('Rut invalido');
        err.statusCode = 400;
        throw err;
    }
    console.log('rut validado')
    if (!validaNombre(nombre)){
        console.log('err validanombre');
        // return res.status(400).json(
        //     {
        //         msj: 'Nombre invalido'
        //     }
        // )
        const err = new Error('Nombre invalido');
        err.statusCode = 400;
        throw err;
    }
    console.log('nombre validado')
    if (!validaNombre(apepat)){
        console.log('err validaapepat');
        // return res.status(400).json(
        //     {
        //         msj: 'Apellido paterno invalido'
        //     }
        // )
        const err = new Error('Apellido paterno invalido');
        err.statusCode = 400;
        throw err;
    }
    console.log('apepat validado')
    if (!validaNombre(apemat)){
        console.log('err validaapemat');
        // return res.status(400).json(
        //     {
        //         msj: 'Apellido materno invalido'
        //     }
        // )
        const err = new Error('Apellido materno invalido');
        err.statusCode = 400;
        throw err;
    }
    console.log('apemat validado')
    if(!validaEmail(email)){
        console.log('err validaemail');
        // return res.status(400).json(
        //     {
        //         msj: 'Email invalido'
        //     }
        // )
        const err = new Error('Email invalido');
        err.statusCode = 400;
        throw err;
    }
    console.log('email validado')
    if (!validaPassword(password)){
        console.log('err validapassword');
        // return res.status(400).json(
        //     {
        //         msj: 'Password invalido'
        //     }
        // )
        const err = new Error('Password invalido');
        err.statusCode = 400;
        throw err;
    }
    
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
        role: "teacher_role"
    }
        

    try{
       
        const userDoc = UserModel(dataToSave);
        const savedUser = await userDoc.save();
        console.log('savedUser',savedUser)

        let teacherInfo = {
            userId: savedUser._id,
        }
        //subject, school_year
        if (subject){
            const subjectDoc = await SubjectModel.exists({_id: subject});
            if(subjectDoc){
                teachersInfo.subject = [subject];
            }
            
        }
        if (schoolYear){
            const gradeDoc = await GradeModel.exists({school_year: schoolYear});
            if(gradeDoc){
                teachersInfo.school_year = [schoolYear];
            }
            
        }
        try {
            const teacherDoc = TeacherModel(teacherInfo);
            savedTeacher = teacherDoc.save();

            const payload = {
                rut: userDoc.rut,
                nombre: userDoc.nombre,
                apellidoPat: userDoc.apellidoPat,
                apellidoMat: userDoc.apellidoMat,
                email: userDoc.email,
                role: userDoc.role
            }
            
            return res.status(201).json({
                msj: 'Profesor creado',
                data: payload
            })
        } catch (e) {
            const deletedUser = await UserModel.findByIdAndDelete(savedUser._id);
            console.log(deletedUser);
            e.statusCode = 500;
            throw e;
        }
        // const teacherDoc = TeacherModel(teacherInfo);
        // savedTeacher = teacherDoc.save();



        // const payload = {
        //     rut: userDoc.rut,
        //     nombre: userDoc.nombre,
        //     apellidoPat: userDoc.apellidoPat,
        //     apellidoMat: userDoc.apellidoMat,
        //     email: userDoc.email,
        //     role: userDoc.role
        // }
        
        // return res.status(201).json({
        //     msj: 'Usuario creado',
        //     data: payload
        // })
                            
    }catch(e){
        // res.status(500).json(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e)
    }
}

const addSubject = async (req, res, next) => {
    try {
        const {teacherId} = req.params;
        const {subjectId} = req.body;
        console.log('teacherId',teacherId);

        const teacherDoc = await TeacherModel.findById(teacherId);
        if (!teacherDoc){
            const err = new Error('Profesor no existe');
            err.statusCode = 400;
            throw err;
        }

        const subjectDoc = await SubjectModel.exists({_id: subjectId});
        if (!subjectDoc){
            const err = new Error('Asignatura no existe');
            err.statusCode = 400;
            throw err;
        }

        console.log('teacherDoc 1', teacherDoc);
        await teacherDoc.addSubject(subjectId)
        console.log('teacherDoc 2', teacherDoc);
        res.status(200).json({
            data:teacherDoc
        })
    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

const addSchoolYear = async (req, res, next) => {
    try {
        const {teacherId} = req.params;
        console.log('teacherId',teacherId);
        res.status(200).json({
            data:teacherId
        })
    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

const getTeachers = async (req, res, next) => {
    
    try {
        const teachersDocs = await TeacherModel.find().populate('userId');
        const teachersData = teachersDocs.map(teacher =>{
            return {
                name: `${teacher.nombre} ${teacher.apellidoPat}`
            }
        });
        return res.status(200).json({
            data: teachersDocs
        })

    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

module.exports = {
    addTeacher,
    getTeachers,
    addSubject,
    addSchoolYear
}