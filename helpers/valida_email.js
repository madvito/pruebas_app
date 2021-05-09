const validaEmail = (email) => {
    if (email.length < 7){
        return false;
    }else{
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email)){
            return false;
        }else{
            return true;
        }
    }
}

module.exports = validaEmail;