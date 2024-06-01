const { Router } = require("express");
const {
  getShowingsByCinemaAndDate,
  getShowingsByCinemaMovieDate,
  getHallSizeByShowingId,
} = require("../controllers/showing");
const router = Router();
const API_ROUTE = "/showings";

router.get(
  `${API_ROUTE}/cinema/:cinema_id/date/:date`,
  getShowingsByCinemaAndDate
);
router.get(
  `${API_ROUTE}/cinema/:cinema_id/movie/:movie_name/date/:date`,
  getShowingsByCinemaMovieDate
);
router.get(`${API_ROUTE}/hall/:showing_id`, getHallSizeByShowingId);

module.exports = router;
