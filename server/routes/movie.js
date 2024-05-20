const {Router} = require('express');
const {getMovies, addReview, getMoviesByReviewScore} = require('../controllers/movie');
const router = Router();
const API_ROUTE = '/movies';

router.get(API_ROUTE, getMovies);
router.post(`${API_ROUTE}/review`, addReview);
router.get(`${API_ROUTE}/review/:score`, getMoviesByReviewScore);

module.exports = router;