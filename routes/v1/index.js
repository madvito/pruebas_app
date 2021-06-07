const express = require('express');
const user = require('./user');
const admin = require('./admin');
const test = require('./test');

const router = express.Router();

router.use('/admin', admin)
router.use('/user', user);
router.use('/test', test);

module.exports = router;