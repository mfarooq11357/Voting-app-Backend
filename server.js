const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors'); // Make sure to require 'cors' 
const bodyParser = require('body-parser'); 


app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // req.body
const PORT =  process.env.PORT

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('Service is Running');
})