const validaNombre = (nombre) =>{
    if (nombre.length < 2){
        return false;
    }else{
        if (!/^[a-zA-Z" "]+$/.test(nombre)){
            return false;
        }
        return true;
    }
}

module.exports = validaNombre;