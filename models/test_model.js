const mongoose = require('mongoose');
const UserModel = require('./user_model');
const SubjectModel = require('./subject_model');
const GradeModel = require('./grade_model');  

const gradeValidator = async (gradeId) => {
    const resp = await GradeModel.exists({
        _id : gradeId
    })
    return resp;
}

const teacherValidator = async (teacherId) => {
    const resp = await UserModel.exists({
        _id : teacherId,
        role: 'teacher_role'
    })
    return resp;
}

const subjectValidator = async (subjectId) => {
    const resp = await SubjectModel.exists({
        _id : subjectId
    })
    return resp;
}

const TestSchema = new mongoose.Schema({
    // grade: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // ref: GradeModel,
    //     required: true,
    //     validate: {
    //         validator: gradeValidator,
    //         message: 'Curso no existe'
    //     }
    // },
    // subject: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     validate: {
    //         validator: subjectValidator,
    //         message: 'Asignatura no existe'
    //     }
    // },
    // created_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     validate: {
    //         validator: teacherValidator,
    //         message: 'Profesor no existe'
    //     }
    // },
    questions: [
        {
            // question_type: {
            //     type: Number,
            //     required: true,
            // },
            points: {
                type: Number,
                required: true
            },
            question_title: {
                type: String,
                required: true
            },
            question_answers: [
                {
                    type: String,
                    required: true
                }
            ],
            correct_answer: {
                type: Number,
                required: true
            }
        }
    ],
    max_points: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Test', TestSchema);