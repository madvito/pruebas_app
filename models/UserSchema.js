const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
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
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model( 'User', UserSchema);