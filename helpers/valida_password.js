const validaPassword = (password) => {
    if (password.length < 6){
        return false;
    }else{
        if (!/[a-zA-Z@\.\*]/.test(password)){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = validaPassword;