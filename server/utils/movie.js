const AppError = require("./error");

class MovieUtils {
  constructor(Movie) {
    this.Movie = Movie;
  }

  async createMovie(title, description, runtime) {
    try {
      await this.Movie.create({ title, description, runtime });
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }

  async addReview(movie_id, score) {
    try {
      const movie = await this.Movie.findById(movie_id);
      movie.reviews.push(score);
      await movie.save();
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  async getMoviesByReviewScore(score) {
    try {
      return await this.Movie.findByAverageReviewScore(score);
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  async getMovieById(id) {
    try {
      return await this.Movie.findById(id);
    } catch (error) {
      throw new AppError(error, 400);
    }
  }
}

module.exports = MovieUtils;
