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
    hall_id: {
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

showingSchema.statics.findByCinemaIdAndDate = function(cinema_id, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({ cinema_id, start_date: { $gte: startOfDay, $lt: endOfDay } })
        .sort({ name: 1, start_date: 1 });
};

showingSchema.index({ cinema_id: 1, movie_id: 1, start_date: 1 }, { unique: true })

module.exports = mongoose.model('Showing', showingSchema);