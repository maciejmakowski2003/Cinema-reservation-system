const mongoose = require('mongoose');
const { Schema } = mongoose;

const validateReview = {
    validator: function (value) {
        return value.every(score => score >= 1 && score <= 10 && Number.isInteger(score));
    },
    message: props => `${props.value} is not a valid review score. Please provide a score between 1 and 10.`
};



const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    runtime: Number,
    reviews: {
        type: [Number],
        required: true,
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