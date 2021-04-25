const express = require('express');
const routesV1 = require('./v1');

const router = express.Router();

router.use('/v1',routesV1);

module.exports = router;