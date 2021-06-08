const jwt = require('jsonwebtoken');
const TeacherModel = require('../models/teacher_model');
const UserModel = require('../models/user_model');

const isAuth = (req, res, next) => {
    const token = req.get('Authorization');
    console.log('header token', token);
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('token decodificado', decoded);
        req.user = decoded;
        next();
    }catch(e){
        console.log(e);
        e.statusCode = 401;
        next(e)
    }
}

const isTeacher = async(req, res, next) => {
    const user = req.user;
    const userId = user.user;
    console.log(userId);
    try {
        if (user.role === 'teacher_role'){
            
            const teacherDoc = await TeacherModel.findOne({userId: userId});
            if (!teacherDoc){
                const err = new Error('Profesor no existe');
                err.statusCode = 401;
                throw err;
            }
            req.teacher = {
                teacherId: teacherDoc._id,
                teacherSubject: teacherDoc.subject,
                teacherSchoolYear: teacherDoc.school_year
            }

            next();
        }else{
            const err = new Error('Rol no válido');
            err.statusCode = 401;
            throw err;
        }
    } catch (e) {
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e)
    }

    
}

const isStudent = async (req, res, next) => {
    const user = req.user;
    console.log(user);
    try {
        if (user.role === 'student_role'){
            const studentDoc = await UserModel.findById(user.user);
            if (!studentDoc){
                const err = new Error('No es usuario');
                err.statusCode = 401;
            }
            req.student = {
                studentId: studentDoc._id,
                studentGrade: studentDoc.grade
            }


            next();
        }else{
            const err = new Error('Rol no válido');
            err.statusCode = 401;
            next(err);
        }
    } catch (e) {
        
    }
    
}

module.exports = {
    isAuth,
    isTeacher,
    isStudent
}