'use strict';
const express = require('express');
const morgan = require('morgan');

// Create express server
const app = express();

// Setup logger
app.use(morgan(':date[iso] :status :method :url [:response-time ms] :remote-addr'));

// Enable JSON parsing 
app.use(express.json());

// Enable form data parsing
app.use(express.urlencoded({
    extended: false
}));

// Prepare routes
const serviceRoutes = require("./service");
Object.values(serviceRoutes).forEach(route => {
    app.use("/CompanyServices", route);
});

module.exports = app;