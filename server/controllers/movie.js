const Movie = require("../models/movie");
const MovieUtils = require("../utils/movie");
const movieUtils = new MovieUtils(Movie);

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find(req.query);
    res.status(200).json(movies);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { movie_id, score } = req.body;
    await movieUtils.addReview(movie_id, score);

    res.status(200).json({ message: "Review added" });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

const getMoviesByReviewScore = async (req, res) => {
  try {
    const { score } = req.params;
    const movies = await movieUtils.getMoviesByReviewScore(parseFloat(score));

    res.status(200).json(movies);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await movieUtils.getMovieById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
};

module.exports = {
  getMovies,
  addReview,
  getMovieById,
  getMoviesByReviewScore,
};
