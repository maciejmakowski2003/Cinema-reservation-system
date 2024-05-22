const {Router} = require('express');
const { createOrder, getUserOrders, getCinemaMonthlyIncome, getCinemaMonthlyIncomeForEachMovie } = require('../controllers/order');
const {authenticate} = require('../middleware/auth');
const router = Router();
const API_ROUTE = '/orders';

router.get(`${API_ROUTE}/user`, authenticate, getUserOrders);
router.get(`${API_ROUTE}/income/cinema/:cinema_id/month/:month/year/:year`, getCinemaMonthlyIncome);
router.get(`${API_ROUTE}/income/cinema/:cinema_id/month/:month/year/:year/movies`, getCinemaMonthlyIncomeForEachMovie);
router.post(API_ROUTE, authenticate, createOrder);

module.exports = router;