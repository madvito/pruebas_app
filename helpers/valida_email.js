const validaEmail = (email) => {
    if (email.length < 7){
        console.log('email corto')
        return false;
    }else{
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email)){
            console.log('email formato incorrecto')
            return false;
        }else{
            console.log('email formato correcto')
            return true;
        }
    }
}

module.exports = validaEmail;