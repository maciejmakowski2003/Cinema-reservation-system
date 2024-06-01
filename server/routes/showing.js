const {Router} = require('express');
const { getShowings, getShowing} = require('../controllers/showing');
const router = Router();
const API_ROUTE = '/showings';

router.get(API_ROUTE, getShowings);
router.get(`${API_ROUTE}/:showingId`, getShowing);
module.exports = router;