const bcrypt = require('bcrypt');

const {validaNombre,validaEmail,validaPassword,validaRut} = require("../../helpers/register_validators");
const UserModel = require("../../models/user_model");
const TeacherModel = require("../../models/teacher_model");
const SubjectModel = require("../../models/subject_model");
const GradeModel = require("../../models/grade_model");

const addTeacher = async (req, res, next) => {
    
    const {rut, nombre, apepat, apemat, email, password,  securityCode} = req.body;
    console.log(rut, nombre, apepat, apemat, email, password, securityCode);
    try{
        console.log('process.env.TEACHER_CODE', process.env.TEACHER_CODE)
        if (securityCode != process.env.TEACHER_CODE){
            console.log('err codigo profesor');
            const err = new Error('Código de seguridad invalido');
            err.statusCode = 401;
            throw err;
        }

        if(!validaRut(rut)){
            console.log('err validarut');
    
            const err = new Error('Rut invalido');
            err.statusCode = 400;
            throw err;
        }
        console.log('rut validado')
        if (!validaNombre(nombre)){
            console.log('err validanombre');
    
            const err = new Error('Nombre invalido');
            err.statusCode = 400;
            throw err;
        }
        console.log('nombre validado')
        if (!validaNombre(apepat)){
            console.log('err validaapepat');
        
            const err = new Error('Apellido paterno invalido');
            err.statusCode = 400;
            throw err;
        }
        console.log('apepat validado')
        if (!validaNombre(apemat)){
            console.log('err validaapemat');

            const err = new Error('Apellido materno invalido');
            err.statusCode = 400;
            throw err;
        }
        console.log('apemat validado')
        if(!validaEmail(email)){
            console.log('err validaemail');

            const err = new Error('Email invalido');
            err.statusCode = 400;
            throw err;
        }
        console.log('email validado')
        if (!validaPassword(password)){
            console.log('err validapassword');

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
        

    
       
        const userDoc = UserModel(dataToSave);
        const savedUser = await userDoc.save();
        console.log('savedUser',savedUser)

        let teacherInfo = {
            userId: savedUser._id,
        }
        //subject, school_year
        // if (subject){
        //     const subjectDoc = await SubjectModel.exists({_id: subject});
        //     if(subjectDoc){
        //         teachersInfo.subject = [subject];
        //     }
            
        // }
        // if (schoolYear){
        //     const gradeDoc = await GradeModel.exists({school_year: schoolYear});
        //     if(gradeDoc){
        //         teachersInfo.school_year = [schoolYear];
        //     }
            
        // }
        try {
            const teacherDoc = TeacherModel(teacherInfo);
            const savedTeacher = await teacherDoc.save();

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
                data: savedTeacher
            })
        } catch (e) {
            console.log('borrando usuario');
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
            message:'Asignatura agregada correctamente',
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
        if (!teacherId){
            const err = new Error('Ingrese Id de profesor');
            err.statusCode = 400;
            throw err;
        }
        const {schoolYear} = req.body;
        if (!schoolYear){
            const err = new Error('Ingrese nivel escolar');
            err.statusCode = 400;
            throw err;
        }
        console.log('teacherId',teacherId);
        console.log('schoolYear',schoolYear);
        const gradeDoc = await GradeModel.exists({school_year: schoolYear});
        if (!gradeDoc){
            const err = new Error('El nivel escolar ingresado no esta registrado');
            err.statusCode = 400;
            throw err;
        }
        const teacherDoc = await TeacherModel.findById(teacherId);
        if (!teacherDoc){
            const err = new Error('El profesor no existe');
            err.statusCode = 400;
            throw err;
        }
        await teacherDoc.addSchoolYear(schoolYear);
        res.status(200).json({
            message: 'Nivel escolar agregado correctamente',
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

const getTeachers = async (req, res, next) => {
    
    try {
        const teachersDocs = await TeacherModel.find().populate('userId').populate('subject');
        
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