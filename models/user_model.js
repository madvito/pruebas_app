const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellidoPat: {
        type: String,
        required: true
    },
    apellidoMat: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'student_role',
    },
    school_year:{
        type: [Number],
        required: true
    },
    grade:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grade'
    }

})

module.exports = mongoose.model( 'User', UserSchema);