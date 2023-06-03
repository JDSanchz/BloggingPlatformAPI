const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogsController = require('../controllers/blogs');


const { requiresAuth } = require('express-openid-connect');

router.get('/', requiresAuth(), blogsController.getAll);

const { param } = require('express-validator');

//🧱DELETE FUNCTION THAT USES REMOVE WITH DATA VALIDATION🧱
router.delete('/:id', blogsController.remove);


//🧱POST FUNCTION THAT USES CREATE WITH DATA VALIDATION🧱
router.post('/',
  [
    body('message')
      .notEmpty()
      .withMessage('Message field is required')
      .isLength({ min: 100 })
      .withMessage('Message must be at least 100 characters'),
    body('userId')
      .notEmpty()
      .withMessage('User ID field is required'),
  ],
  blogsController.create
);

//🧱PUT FUNCTION THAT USES UPDATE WITH DATA VALIDATION🧱
router.put('/:id',
  [
    body('message')
      .notEmpty()
      .withMessage('Message field is required')
      .isLength({ min: 100 })
      .withMessage('Message must be at least 100 characters'),
    body('userId')
      .notEmpty()
      .withMessage('User ID field is required'),
  ],
  blogsController.update
);


module.exports = router;