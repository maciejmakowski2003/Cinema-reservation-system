require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

const mongoose = require('mongoose');
const dbConnection = require('./config/db');

const morgan = require('morgan'); 
app.use(morgan('tiny'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const userRouter = require('./routes/user');

dbConnection(mongoose);

app.use(userRouter);

const Cinema = require('./models/cinema');
const Showing = require('./models/showing');
const CinemaUtils = require('./utils/cinema');
const cinemaUtils = new CinemaUtils(Cinema, Showing);
//cinemaUtils.createCinema('Multikino', 'multikinokrakow@gmail.com', cinemaUtils.generateAddress('ul.Dobrego Pasterza 13', 'Kraków', 'małopolskie', 'Polska', '00-000'), { open: '08:00', close: '23:00' });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});