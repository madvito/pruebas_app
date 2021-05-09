const validaNombre = (nombre) =>{
    if (nombre.length < 2){
        console.log('nombre corto')
        return false;
    }else{
        if (!/^[a-zA-Z" "]+$/.test(nombre)){
            console.log('nombre formato incorrecto')
            return false;
        }
        console.log('nombre formato correcto')
        return true;
    }
}

module.exports = validaNombre;