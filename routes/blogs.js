const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const blogsController = require('../controllers/blogs');
const { param } = require('express-validator');

const { requiresAuth } = require('express-openid-connect');

//🧱GET ALL FUNCTION THAT USES AUTH0🧱
router.get('/', requiresAuth(), blogsController.getAll);

//🧱DELETE FUNCTION THAT USES REMOVE WITH DATA VALIDATION🧱
router.delete('/:id', blogsController.remove);


//🧱POST FUNCTION THAT USES CREATE WITH DATA VALIDATION🧱
router.post('/',
  [
    body('title')
      .notEmpty()
      .withMessage('Title field is required')
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters'),
    body('tags')
      .isArray()
      .withMessage('Tags field must be an array of strings'),
    body('comments')
      .isNumeric()
      .withMessage('Comments field must be a numeric ID'),
    body('message')
      .notEmpty()
      .withMessage('Message field is required')
      .isLength({ min: 5 })
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
    body('title')
      .notEmpty()
      .withMessage('Title field is required')
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters'),
    body('tags')
      .isArray()
      .withMessage('Tags field must be an array of strings'),
    body('comments')
      .isNumeric()
      .withMessage('Comments field must be a numeric ID'),
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