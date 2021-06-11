const express = require('express');
const { createTest, applyTest, getAllTests, getTestById, getAnsweredTestById } = require('../../controller/v1/test');
const { isAuth, isStudent, isTeacher } = require('../../middlewares/auth');

const router = express.Router();

router.post('/',isAuth, isTeacher, createTest);

router.post('/apply/:testId',isAuth, isStudent,applyTest);

router.get('/', isAuth, isTeacher, getAllTests) // get todas las pruebas

router.get('/:testId', isAuth, getTestById) //traer prueba por id

router.get('/applied/:testId', isAuth, isTeacher, getAnsweredTestById) //prueba respondida por id prueba


module.exports = router;