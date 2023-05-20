const express = require('express');
const router = express.Router();

router.use('/blogs', require('./blogs'));

module.exports = router;
