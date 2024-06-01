require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const dbConnection = require('./config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user'); 
const cinemaRouter = require('./routes/cinema');
const movieRouter = require('./routes/movie');
const showingRouter = require('./routes/showing');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());
dbConnection(mongoose);

app.use(userRouter);
app.use(cinemaRouter);
app.use(movieRouter);
app.use(showingRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});