const {Router} = require('express');
const {getCinemas} = require('../controllers/cinema');
const router = Router();
const API_ROUTE = '/cinemas';

router.get(API_ROUTE, getCinemas);

module.exports = router;