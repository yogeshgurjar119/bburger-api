const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const Route = require('./src/Routes/User/routes')

const cors = require('cors')

const DB_NAME = process.env.DB_NAME
const Db_URL = process.env.MONGODB_URL + '/' + DB_NAME
mongoose.set('strictQuery', true);
mongoose.connect(Db_URL).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
})

app.use(cors())

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }))
//middleware
app.use(express.json());

// Middleware function to trim req.body
app.use((req, res, next) => {
    // Check if the request has a body
    if (req.body) {
        // Trim each value in req.body
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    console.log("HTTP method is " + req.method + ", URL -" + req.url);
    next(); // Proceed to the next middleware or route handler
});

app.use(Route);




app.listen(process.env.ADMIN_PORT, () => {
    console.log(`Admin Backend server is running on:- ${process.env.ADMIN_PORT}`);
});