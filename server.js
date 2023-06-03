const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const fs = require('fs');
const app = express();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//🔒AUTH0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://bloggingapi1.onrender.com/',
  clientID: 'ccXgi10WcYaLDc7ggmteNbTLOfttrbQm',
  issuerBaseURL: 'https://dev-5pm6oxa2htvy7b6m.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


app.get('/profile', requiresAuth(), async (req, res) => {
  try {
    // Get the user's ID
    const userId = req.oidc.user.sub;

    // Connect to MongoDB and get the 'accounts' collection
    const accountsCollection = mongodb.getDb().db().collection('accounts');

    // Insert the user's ID into the 'accounts' collection
    const result = await accountsCollection.insertOne({
      _id: userId,
    });

    res.send(`Inserted document with ID ${result.insertedId}`);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while trying to save user information');
  }
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

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

