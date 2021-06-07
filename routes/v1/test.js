const express = require('express');
const { createTest, applyTest } = require('../../controller/v1/test');

const router = express.Router();

router.post('/', createTest);

router.post('/apply',applyTest);

module.exports = router;