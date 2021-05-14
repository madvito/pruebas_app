const validaRut = (rut) => {
    console.log('validarut',rut)
    if (rut.length < 3){
        console.log('rutchico')
        return false;
    }else{
        console.log('paso validacion largo');

        const formatedRut = rut.replace(/(\.|\-)/g,'');
        console.log(formatedRut)
        const verifierCode = formatedRut.slice(-1);
        const rutBody = formatedRut.slice(0,-1)
        let formattedVerifierCode;

        console.log('rutbody:',rutBody,'cod:', verifierCode)

        if (isNaN(rutBody)){
            console.log('isNaN Body')
            return false;
        }else{
            console.log('rut son numeros');
            if (!/^([0-9]|k|K)$/.test(verifierCode)){
                console.log('regex verificador')
                return false;
            }else{
                console.log('cod verificador valido');

                if(isNaN(verifierCode)){
                    formattedVerifierCode = verifierCode.toUpperCase();
                }else{
                    formattedVerifierCode = parseInt(verifierCode);
                }
                
                const rutArray = rutBody.split('');
                console.log('rutArray',rutArray)
        
                let multiplier = 2;
                let rutSum = 0;
                let current;
                for (let i = rutArray.length-1; i>= 0; i--){
                    
                    console.log('multiplier',multiplier)
                    console.log(`${rutArray[i]}x${multiplier}:`,parseInt(rutArray[i]),multiplier,parseInt(rutArray[i]) * multiplier)
                    current = parseInt(rutArray[i]) * multiplier;
                    rutSum += current;
                    console.log(rutSum)
        
                    if (multiplier === 7){
                        multiplier = 2;
                    }else{
                        multiplier++;
                    }
                }
                const mod11 =rutSum % 11;
                const realVerifierCode =  11 - mod11;
        
                let formatedRealVerifierCode;
                console.log(rutSum,mod11)
                
                if(realVerifierCode === 10){
                    formatedRealVerifierCode = 'K';
                }else if(realVerifierCode === 11){
                    formatedRealVerifierCode = 0;
                }else{
                    formatedRealVerifierCode = realVerifierCode;
                }
        
                console.log('comparar verificador',formatedRealVerifierCode, formattedVerifierCode)
                if(formatedRealVerifierCode === formattedVerifierCode){
                    console.log('rut correcto')
                    return true;
                }else{
                    console.log('rut incorrecto')
                    return false;
                }
            } 
        }
        
    }

    
}

module.exports = validaRut;