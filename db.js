// const mongoose = require('mongoose');
// require('dotenv').config();

// // Define the MongoDB connection URL
// const Mongodb_uri = 'mongodb://meow11357:meowmeow11357@ac-ctfovez-shard-00-00.nrsbp0y.mongodb.net:27017,ac-ctfovez-shard-00-01.nrsbp0y.mongodb.net:27017,ac-ctfovez-shard-00-02.nrsbp0y.mongodb.net:27017/?replicaSet=atlas-1135kq-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
// // Set up MongoDB connection
// mongoose.connect(Mongodb_uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// // Get the default connection
// // Mongoose maintains a default connection object representing the MongoDB connection.
// const db = mongoose.connection;

// // Define event listeners for database connection

// db.on('connected', () => {
//     console.log('Connected to MongoDB server');
// });

// db.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });

// db.on('disconnected', () => {
//     console.log('MongoDB disconnected');
// });

// // Export the database connection
// module.exports = db;

const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI 
// Set up MongoDB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Get the default connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export the database connection
module.exports = db;