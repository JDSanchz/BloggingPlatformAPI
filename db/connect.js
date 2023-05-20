// Import 'dotenv' package to load environment variables from '.env' file
const dotenv = require('dotenv');
// Configure 'dotenv' to load environment variables
dotenv.config();

// Import the 'MongoClient' class from the 'mongodb' package
const MongoClient = require('mongodb').MongoClient;

// Declare a variable '_db' to store the database connection
let _db;

// Define a function 'initDb' to initialize the database connection
const initDb = (callback) => {
  // Check if '_db' is already initialized
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  // Connect to the MongoDB server using the URI from environment variables
  MongoClient.connect(process.env.URI)
    .then((client) => {
      // Set the '_db' variable to the connected 'client' object
      _db = client;
      // Invoke the 'callback' function with '_db' as an argument
      callback(null, _db);
    })
    .catch((err) => {
      // Invoke the 'callback' function with an error object if the connection fails
      callback(err);
    });
};

// Define a function 'getDb' to return the database connection object
const getDb = () => {
  // Throw an error if the database connection is not initialized
  if (!_db) {
    throw Error('Db not initialized');
  }
  // Return the database connection object
  return _db;
};

// Export the 'initDb' and 'getDb' functions as a module
module.exports = {
  initDb,
  getDb,
};
