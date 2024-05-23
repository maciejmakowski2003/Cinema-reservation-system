const {Router} = require('express');
const { createOrder, getUserOrders, getMonthlyIncomeForEachMovie, getMonthlyNumberOfBookedTicketsForEachCinema } = require('../controllers/order');
const {authenticate} = require('../middleware/auth');
const router = Router();
const API_ROUTE = '/orders';

router.get(`${API_ROUTE}/user`, authenticate, getUserOrders);
router.get(`${API_ROUTE}/income/month/:month/year/:year/movies`, getMonthlyIncomeForEachMovie);
router.get(`${API_ROUTE}/tickets/month/:month/year/:year/cinemas`, getMonthlyNumberOfBookedTicketsForEachCinema);
router.post(API_ROUTE, authenticate, createOrder);

module.exports = router;