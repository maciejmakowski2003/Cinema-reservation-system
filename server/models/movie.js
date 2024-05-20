const mongoose = require('mongoose');
const { Schema } = mongoose;

const validateReview = {
    validator: function (value) {
        return value.every(score => score >= 1 && score <= 5 && Number.isInteger(score));
    },
    message: props => `${props.value} is not a valid review score. Please provide a score between 1 and 5.`
};



const movieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide the movie title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide the movie description']
    },
    runtime: {
        type: Number,
        required: [true, 'Please provide the runtime of the movie']
    },
    reviews: {
        type: [Number],
        required: [true, 'Please provide reviews for the movie'],
        default: [],
        validate: validateReview,
    }
});

movieSchema.statics.findByAverageReviewScore = function(score) {
    return this.aggregate([
        { $addFields: { averageReview: { $avg: "$reviews" } } },
        { $match: { averageReview: { $gte: score } } }
    ]);
};

module.exports = mongoose.model('Movie', movieSchema);