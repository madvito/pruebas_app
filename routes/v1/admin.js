const express = require('express');
const {addTeacher, getTeachers, addSubject, addSchoolYear} = require('../../controller/v1/admin')
const { addGrade } = require('../../controller/v1/grade');
const { addSubject : postSubject } = require('../../controller/v1/subject');
const { isAuth, isTeacher } = require('../../middlewares/auth');

const router = express.Router();

router.post('/teacher',addTeacher);
router.get('/teacher',isAuth, isTeacher, getTeachers);
router.put('/teacher/subject/:teacherId',isAuth, isTeacher, addSubject);
router.put('/teacher/schoolyear/:teacherId',isAuth, isTeacher, addSchoolYear);

router.post('/grade',isAuth, isTeacher, addGrade);
router.post('/subject',isAuth, isTeacher, postSubject);

module.exports = router;