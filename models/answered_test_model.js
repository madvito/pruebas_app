const mongoose = require('mongoose');

const AnsweredTestSchema = new mongoose.Schema({
    test_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    student_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers:{
        type: [Number],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    approvalPercentage: {
        type: Number,
        required: true
    }

})

module.exports = mongoose.model('AnsweredTest',AnsweredTestSchema);