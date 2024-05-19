const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatScheme = require('./seat');

const hallSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide the name of the hall'],
    },
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: [true, 'Please provide the cinema ID'],
    },
    seats: {
        type: [seatScheme],
        required: [true, 'Please provide the seats configuration'],
    }
});

module.exports = mongoose.model('Hall', hallSchema);


