const express = require('express');
const router = express.Router();

const blogsController = require('../controllers/blogs');

router.get('/', blogsController.getAll);
router.post('/', blogsController.create);

module.exports = router;
