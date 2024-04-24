const mongoose = require('mongoose');
const { Schema } = mongoose;

const openingHoursSchema = new Schema({
    monday: {
        open: String,
        close: String,
    },
    tuesday: {
        open: String,
        close: String,
    },
    wednesday: {
        open: String,
        close: String,
    },
    thursday: {
        open: String,
        close: String,
    },
    friday: {
        open: String,
        close: String,
    },
    saturday: {
        open: String,
        close: String,
    },
    sunday: {
        open: String,
        close: String,
    }
});

const cinemaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
    },
    opening_hours: {
        type: openingHoursSchema,
        required: true,
    },
    halls: {
        type: [Schema.Types.ObjectId],
        ref: 'Hall',
        default: [],
    }
});

module.exports = mongoose.model('Cinema', cinemaSchema);