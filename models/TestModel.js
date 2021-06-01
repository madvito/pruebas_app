const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    grade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: GradeModel,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SubjectModel,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
        required: true
    },
    questions: [
        {
            question_type: {
                type: Number,
                required: true,
            },
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
                    type: String | Number
                }
            ],
            correct_answer: Number,
        }
    ],
    max_points: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('TestModel', TestSchema);