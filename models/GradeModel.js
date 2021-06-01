const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    grade_name: {
        type: String,
        required: true
    },
    school_year:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('GradeModel', GradeSchema);