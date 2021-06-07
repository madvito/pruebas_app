const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const token = req.get('Authorization');
    console.log('header token', token);
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    }catch(e){
        console.log(e);
        //TODO: MODIFICAR CUANDO HAGA HANDLER HANDLER
        // return res.status(401).json({
        //     error: e
        // })
        e.statusCode = 401;
        next(err)
    }
}

const isTeacher = (req, res, next) => {
    const user = req.user;

    if (user.role === 'teacher_role'){
        next();
    }else{
        const err = new Error('Rol no válido');
        //TODO: MODIFICAR CUANDO HAGA HANDLER HANDLER
        err.statusCode = 401;
        // return res.status(401).json(err);
        next(err);
    }
}

module.exports = {
    isAuth,
    isTeacher,
}