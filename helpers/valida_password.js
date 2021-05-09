const validaPassword = (password) => {
    if (password.length < 6){
        console.log('pass corto')
        return false;
    }else{
        if (!/[a-zA-Z0-9@\.\*]/.test(password)){
            console.log('formato pass incorrecto')
            return false;
        }else{
            console.log('formato pass correcto')
            return true;
        }
    }
}

module.exports = validaPassword;