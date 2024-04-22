// Load environment variables from .env file
require('dotenv').config();

// Import required libraries
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes'); // Import router from separate file

// Create an Express application instance
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Database Connected');

        // Define route for the root endpoint ("/")
        app.get("/", (req, res) => {
            res.status(200).send(`<h1>Welcome to task management app</h1>`);
        });

        // Set up middleware
        app.use(express.json()); // Parse JSON bodies
       /* app.use(cors({
            //origin: 'http://localhost:3000',
            origin: 'https://comfy-mousse-86384e.netlify.app/', // Allow requests from this origin
            methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
            credentials: true // Allow cookies to be sent cross-origin
        }));
        app.use(cookieParser()); // Parse cookies */
        const allowedOrigins = ['http://localhost:3000', 'https://comfy-mousse-86384e.netlify.app'];

    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true); // Allow the request
            } else {
                callback(new Error('Not allowed by CORS')); // Block the request
            }
        },
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        credentials: true // Allow cookies to be sent cross-origin
    }));

        // Mount the router for API endpoints under "/api"
        app.use('/api', router);

        // Start the Express server
        const PORT = process.env.PORT || 5000; // Use specified port or default to 5000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
