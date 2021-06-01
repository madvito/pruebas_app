const express = require('express');
const user = require('./user');
const grade = require('./grade');

const router = express.Router();

router.use('/user', user);
router.use('/grade', grade);

module.exports = router;