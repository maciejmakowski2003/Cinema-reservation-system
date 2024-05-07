const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatScheme = require('./seat');

const priceValidator = {
    validator: function (value) {
        return value >= 0;
    },
    message: props => `${props.value} is not a valid price. Please provide a price greater than or equal to 0.`
};


const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    showing_id: {
        type: Schema.Types.ObjectId,
        ref: 'Showing',
        required: true,
    },
    tickets: {
        type: [seatScheme],
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
        validate: priceValidator,
    }
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
