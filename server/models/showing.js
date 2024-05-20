const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatScheme = require('./seat');


const showingSchema = new Schema({
    cinema_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cinema',
        required: [true, 'Cinema ID is required'],
    },
    movie_id: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie ID is required'],
    },
    movie_name: {
        type: String,
        required: [true, 'Movie name is required'],
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    hall_id: {
        type: Schema.Types.ObjectId,
        ref: 'Hall',
        required: [true, 'Hall ID is required'],
    },
    price: {
        standard: {
            type: Number,
            required: [true, 'Standard price is required'],
        },
        vip: {
            type: Number,
            required: [true, 'VIP price is required'],
        },
    },
    format: {
        type: {
            type: String,
            enum: {
                values: ['2D', '3D', '4D'],
                message: 'Format type must be either 2D, 3D, or 4D',
            },
            required: [true, 'Format type is required'],
        },
        language: {
            type: String,
            enum: {
                values: ['subtitled', 'dubbed', 'original', 'voiceover'],
                message: 'Language must be subtitled, dubbed, original, or voiceover',
            },
            required: [true, 'Language is required'],
        }
    },
    seats: {
        type: [seatScheme],
        required: [true, 'Seats are required'],
    },
});


showingSchema.statics.findByCinemaAndDate = function(cinema_id, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({ cinema_id, start_date: { $gte: startOfDay, $lt: endOfDay } })
        .sort({ movie_name: 1, start_date: 1 }).select({ seats: 0 });
};

showingSchema.index({ cinema_id: 1, movie_id: 1, start_date: 1 }, { unique: true })

module.exports = mongoose.model('Showing', showingSchema);