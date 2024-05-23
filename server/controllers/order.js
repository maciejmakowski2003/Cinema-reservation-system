const Order = require('../models/order');
const Showing = require('../models/showing');
const Movie = require('../models/movie');
const Hall = require('../models/hall');
const User = require('../models/user');
const Cinema = require('../models/cinema');
const OrderUtils = require('../utils/order');
const orderUtils = new OrderUtils(Order, Showing, Movie, Hall, User, Cinema);

const createOrder = async (req, res) => {
    try {
        await orderUtils.createOrder(req.user_id);

        res.status(201).json({ message: 'Order created' });
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
}

const getUserOrders = async (req, res) => {
    try {
        const orders = await orderUtils.getUserOrders(req.user_id);

        res.status(200).json(orders);
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
}

const getMonthlyIncomeForEachMovie = async (req, res) => {
    try {
        const { month, year } = req.params;
        const income = await orderUtils.getMonthlyIncomeForEachMovie(month, year);

        res.status(200).json(income);
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
}

const getMonthlyNumberOfBookedTicketsForEachCinema = async (req, res) => {
    try {
        const { month, year } = req.params;
        const income = await orderUtils.getMonthlyNumberOfBookedTicketsForEachCinema(month, year);

        res.status(200).json(income);
    } catch(error) {
        res.status(error.status || 400).json({ message: error.message });    
    }
}


module.exports = { createOrder, getUserOrders, getMonthlyIncomeForEachMovie, getMonthlyNumberOfBookedTicketsForEachCinema };