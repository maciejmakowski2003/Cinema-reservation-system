const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
});

module.exports = addressSchema;