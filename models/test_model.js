const mongoose = require('mongoose');
const TeacherModel = require('./teacher_model');
const SubjectModel = require('./subject_model');
const GradeModel = require('./grade_model');  



const teacherValidator = async (teacherId) => {
    const resp = await TeacherModel.exists({_id : teacherId})
    return resp;
}

const subjectValidator = async (subjectId) => {
    const resp = await SubjectModel.exists({
        _id : subjectId
    })
    return resp;
}

const TestSchema = new mongoose.Schema({
    grade: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: GradeModel
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject',
        validate: {
            validator: subjectValidator,
            message: 'Asignatura no existe'
        }
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        validate: {
            validator: teacherValidator,
            message: 'Profesor no existe'
        }
    },
    questions: [
        {
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