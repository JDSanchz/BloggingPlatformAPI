const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('blogs').find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error retrieving blogs:', err);
    res.status(500).json({ error: 'An error occurred while retrieving blogs' });
  }
};

const create = async (req, res) => {
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

module.exports = {
  getAll,
  create
};
