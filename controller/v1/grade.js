const GradeModel = require('../../models/grade_model');

const addGrade = async(req, res, next) =>{
    try{
    const {gradeName, schoolYear} = req.body;

    if (!gradeName){
        const err = new Error('Ingresar nombre del curso');
        err.statusCode = 400;
        throw err;
    }

    if (!schoolYear){
        const err = new Error('Ingresar nivel escolar');
        err.statusCode = 400;
        throw err;
    }
    if (isNaN(schoolYear)){
        const err = new Error('Nivel escolar debe ser un número');
        err.statusCode = 400;
        throw err;
    }

    const gradeDoc = new GradeModel({
        grade_name: gradeName,
        school_year: schoolYear
    });
    
        newGrade = await gradeDoc.save();
        console.log('newGrade',newGrade)
        return res.status(201).json({
            message: 'Nuevo curso registrado',
            data: newGrade
        })
    }catch (e){
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
}

module.exports = {
    addGrade
}