const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatScheme = require('./seat');


const showingSchema = new Schema({
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
    },
    movie_id: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    hall: {
        type: Schema.Types.ObjectId,
        ref: 'Hall',
        required: true,
    },
    price: {
        standard: {
            type: Number,
            required: true,
        },
        vip: {
            type: Number,
            required: true,
        },
    },
    format: {
        type: {
            type: String,
            enum: ['2D', '3D', '4D'],
            required: true,
        },
        language: {
            type: String,
            enum: ['subtitled', 'dubbed', 'original', 'voiceover'],
            required: true,
        }
    },
    seats: {
        type: [seatScheme],
        required: true,
    },
});