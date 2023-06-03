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


app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
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

