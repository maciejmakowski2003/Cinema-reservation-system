const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatScheme = new Schema({
    row: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    occupied: Boolean,
});

module.exports = seatScheme;