const { Router } = require("express");
const {
  getMovies,
  addReview,
  getMoviesByReviewScore,
  getMovieById,
} = require("../controllers/movie");
const router = Router();
const API_ROUTE = "/movies";

router.get(API_ROUTE, getMovies);
router.post(`${API_ROUTE}/review`, addReview);
router.get(`${API_ROUTE}/review/:score`, getMoviesByReviewScore);
router.get(`${API_ROUTE}/:id`, getMovieById);

module.exports = router;
