const SubjectModel = require('../../models/subject_model');

const addSubject = async(req, res, next) => {
    try {
        const {subjectName} = req.body;

        if (!subjectName){
            const err = new Error('Ingresar nombre de la asignatura');
            err.statusCode = 400;
        }
        const subjectDoc = SubjectModel({
            subject_name: subjectName
        });
        const savedSubject = await subjectDoc.save();
        console.log(savedSubject);

        res.status(201).json({
            data: savedSubject
        })

    } catch (e) {
        console.log(e);
        if (!e.statusCode){
            e.statusCode = 500;
        }
        next(e);
    }
    
}

module.exports = {addSubject}