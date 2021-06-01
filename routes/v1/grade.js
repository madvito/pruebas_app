const express = require('express');
const { postGrade } = require('../../controller/v1/grade');

const router = express.Router();

router.post('/', postGrade);

module.exports = router;