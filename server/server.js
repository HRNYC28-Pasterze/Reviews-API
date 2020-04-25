var express = require('express');
var bodyParser = require('body-parser');
const router = require('./router.js');

// Create the Express application:
const app = express();

// may delete
app.use(bodyParser.json());

// Import the router and assign it to the correct routes:
app.use('/', router);

module.exports = app;
