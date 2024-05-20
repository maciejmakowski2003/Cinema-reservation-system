const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatScheme = new Schema({
    row: {
        type: String,
        enum: {
            values: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
            message: '{VALUE} is not a valid seat type'
        },
        required: [true, 'Please provide the row of the seat'],
    },
    number: {
        type: String,
        required: [true, 'Please provide the seat number'],
    },
    type: {
        type: String,
        enum: {
            values: ['vip', 'standard'],
            message: '{VALUE} is not a valid seat type'
        },
        default: 'standard',
        required: [true, 'Please provide the type of the seat'],
    },
    occupied: {
        type: Boolean,
        default: false,
    }
},{ _id : false});

module.exports = seatScheme;