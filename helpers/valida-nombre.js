const validaNombre = (nombre) =>{
    if (nombre.length < 2){
        console.log('nombre corto')
        return false;
    }else{
        // if (!/^[a-zA-Z" "]+$/.test(nombre)){
        if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g.test(nombre)){
            console.log('nombre formato incorrecto')
            return false;
        }
        console.log('nombre formato correcto')
        return true;
    }
}

module.exports = validaNombre;