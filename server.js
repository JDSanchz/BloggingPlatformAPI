const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.use('/', require('./routes'));
if (fs.existsSync('./swagger-output.json')) {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
// Start the server and connect to the MongoDB database
mongodb.initDb((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
