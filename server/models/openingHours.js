const mongoose = require('mongoose');
const { Schema } = mongoose;

function isValidTimeFormat(value) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value);
}

const timeSchema = new Schema({
    open: {
        type: String,
        required: [true, 'Please provide the opening time'],
        validate: {
            validator: isValidTimeFormat,
            message: props => `${props.value} is not a valid hour format (HH:MM)`
        }
    },
    close: {
        type: String,
        required: [true, 'Please provide the closing time'],
        validate: {
            validator: isValidTimeFormat,
            message: props => `${props.value} is not a valid hour format (HH:MM)`
        }
    },
});

const openingHoursSchema = new Schema({
    monday: timeSchema,
    tuesday: timeSchema,
    wednesday: timeSchema,
    thursday: timeSchema,
    friday: timeSchema,
    saturday: timeSchema,
    sunday: timeSchema,
});

module.exports = openingHoursSchema;