const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

//🧱GET ALL FUNCTION WITH ERROR HANDLING AND SORTING🧱
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('blogs')
      .find()
      .sort({ date: -1 }) 
      .toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error retrieving blogs:', err);
    res.status(500).json({ error: 'An error occurred while retrieving blogs' });
  }
};


//🧱CREATE FUNCTION WITH ERROR HANDLING🧱
const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const blog = {
      date: new Date(),
      message: req.body.message,
      userId: req.body.userId
    };
    const response = await mongodb.getDb().db().collection('blogs').insertOne(blog);
    res.status(201).json(response);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'An error occurred while creating the blog' });
  }
};

//🧱UPDATE FUNCTION WITH ERROR HANDLING🧱
const update = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedBlog = req.body;

    // Check if blog exists
    const blog = await mongodb.getDb().db().collection('blogs').findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const result = await mongodb.getDb().db().collection('blogs').updateOne({ _id: new ObjectId(blogId) }, { $set: updatedBlog });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'An error occurred while updating the blog' });
  }
};


//🧱REMOVE FUNCTION WITH ERROR HANDLING🧱
const remove = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Check if blog exists
    const blog = await mongodb.getDb().db().collection('blogs').findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const result = await mongodb.getDb().db().collection('blogs').deleteOne({ _id: new ObjectId(blogId) });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: 'An error occurred while deleting the blog' });
  }
};



module.exports = {
  getAll,
  create,
  update,
  remove,
};
