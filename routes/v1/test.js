const express = require('express');
const { createTest, applyTest } = require('../../controller/v1/test');
const { isAuth, isStudent, isTeacher } = require('../../middlewares/auth');

const router = express.Router();

router.post('/',isAuth, isTeacher, createTest);

router.post('/apply/:testId',isAuth, isStudent,applyTest);

module.exports = router;