const express = require('express');
const {addTeacher, getTeachers, addSubject, addSchoolYear} = require('../../controller/v1/admin')
const { addGrade } = require('../../controller/v1/grade');
const { addSubject : postSubject } = require('../../controller/v1/subject');

const router = express.Router();

router.post('/teacher',addTeacher);
router.get('/teacher', getTeachers);
router.put('/teacher/subject/:teacherId', addSubject);
router.put('/teacher/schoolyear/:teacherId', addSchoolYear);

router.post('/grade', addGrade);
router.post('/subject', postSubject);

module.exports = router;