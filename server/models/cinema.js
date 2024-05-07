const mongoose = require('mongoose');
const { Schema } = mongoose;

const openingHoursSchema = require('./openingHours');
const addressSchema = require('./address');

const cinemaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide the cinema name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide the cinema email'],
        unique: true,
    },
    address: {
        type: addressSchema,
        required: [true, 'Please provide the cinema address'],
    },
    opening_hours: {
        type: openingHoursSchema,
        required: [true, 'Please provide the opening hours'],
    },
    halls: {
        type: [Schema.Types.ObjectId],
        ref: 'Hall',
        default: [],
    }
});

module.exports = mongoose.model('Cinema', cinemaSchema);