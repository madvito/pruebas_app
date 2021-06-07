const express = require('express');
const { createTest, applyTest } = require('../../controller/v1/test');
const { isAuth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/',isAuth, createTest);

router.post('/apply',isAuth, applyTest);

module.exports = router;