const mongoose = require('mongoose');
const GradeModel = require('../models/grade_model');

// const yearValidator = async(year) => {
//     if (!year){
//         return true;
//     }
//     const resp = await GradeModel.exists({school_year: year});
//     return resp;
// }
const TeacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Subject',
        // default: []
    },
    // school_year:
    //     {
    //         type: [Number],
    //         required: true,
    //         // default: [],
    //         // validate: {
    //         //     validator: yearValidator,
    //         //     message: 'Nivel escolar no existe'
    //         // }
    //     }
    

})

TeacherSchema.methods.addSubject = function (subjectId) {
    const index = this.subject.findIndex(currentSubject => currentSubject.toString() === subjectId.toString());
    console.log("index", index);

    if (index >= 0){
        const err = new Error('Profesor ya tiene esta asignatura');
        err.statusCode = 400;
        throw err;
    }
    let newSubject = [... this.subject];
    newSubject.push(subjectId);
    this.subject = newSubject;
    return this.save();
}

TeacherSchema.methods.addSchoolYear = function (schoolYear) {
    const index = this.school_year.findIndex(currentGrade => currentGrade === schoolYear);
    console.log("index", index);

    if (index >= 0){
        const err = new Error('Profesor ya tiene este nivel escolar');
        err.statusCode = 400;
        throw err;
    }
    let newSchoolYear = [... this.school_year];
    newSchoolYear.push(schoolYear);
    this.school_year = newSchoolYear;
    return this.save();

}


module.exports = mongoose.model('Teacher', TeacherSchema);