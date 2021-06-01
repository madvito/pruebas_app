const GradeModel = require('../../models/GradeModel');

const postGrade = async(req, res, next) =>{
    const gradeDoc = new GradeModel({
        grade_name: '1° Basico A',
        school_year: 1
    });
    try{
        newGrade = await gradeDoc.save();
        console.log('newGrade',newGrade)
        return res.status(201).json({
            message: 'New grade Added',
            data: newGrade
        })
    }catch (e){
        console.log(e);
        e.statusCode = 500;
        next(e);
    }
}

module.exports = {
    postGrade
}