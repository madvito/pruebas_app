const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    grade_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('GradeModel', GradeSchema);