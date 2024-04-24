const mongoose = require('mongoose');
const { Schema } = mongoose;


const seatScheme = require('./seat');

const hallSchema = new Schema({
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
    },
    seats: {
        type: [seatScheme],
        required: true,
    }
});

module.exports = mongoose.model('Hall', hallSchema);


