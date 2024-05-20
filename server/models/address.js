const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    street: {
        type: String,
        required: [true, 'Please provide the street']
    },
    city: {
        type: String,
        required: [true, 'Please provide the city']
    },
    state: {
        type: String,
        required: [true, 'Please provide the state']
    },
    country: {
        type: String,
        required: [true, 'Please provide the country']
    },
    zipcode: {
        type: String,
        required: [true, 'Please provide the zipcode'],
    }
}, { _id: false });

module.exports = addressSchema;