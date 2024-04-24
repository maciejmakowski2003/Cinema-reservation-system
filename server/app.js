require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

const mongoose = require('mongoose');
const db = require('./config/db');
const Movie = require('./model/movie');

const morgan = require('morgan'); 
app.use(morgan('tiny'));


db(mongoose);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});