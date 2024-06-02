const AppError = require("./error");

class ShowingUtils {
  constructor(Showing, Movie, Hall) {
    this.Showing = Showing;
    this.Movie = Movie;
    this.Hall = Hall;
  }

  async createShowing(cinema_id, movie_id, start_date, hall_id, price, format) {
    try {
      const movie = await this.Movie.findById(movie_id);
      const hall = await this.Hall.findById(hall_id);
      const showing = await this.Showing.create({
        cinema_id,
        movie_id,
        movie_name: movie.title,
        start_date,
        hall_id,
        price,
        format,
        seats: hall.seats,
      });
      return showing;
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  generatePrice(standard, vip) {
    return {
      standard: standard,
      vip: vip,
    };
  }

  generateFormat(type, language) {
    return {
      type: type,
      language: language,
    };
  }

  async getShowingsByCinemaAndDate(cinema_id, date) {
    return await this.Showing.findByCinemaAndDate(cinema_id, date);
  }

  async getShowingsByCinemaMovieDate(cinema_id, movie_name, date) {
    const showings = await this.getShowingsByCinemaAndDate(cinema_id, date);
    return showings.filter((showing) => showing.movie_name === movie_name);
  }

  async getHallSizeByShowingId(showing_id) {
    const showing = await this.Showing.findById(showing_id);
    let dict = {};
    for (let seat of showing.seats) {
      if (dict[seat.row] === undefined) {
        dict[seat.row] = 0;
      }
      dict[seat.row]++;
    }

    return {
      hall_size: dict,
      seats: showing.seats.sort((a, b) => a.row - b.row || a.number - b.number),
    };
  }

  async getShowingById(showing_id) {
    const showing = await this.Showing.findById(showing_id);
    return showing;
  }

  async checkSeatsAvailability(showing, seats) {
    try {
      const showingSeats = showing.seats;
      const showingPrice = showing.price;
      let chosenSeats = [];
      let totalPrice = 0;

      for (let seat of seats) {
        const seatIndex = showingSeats.findIndex(
          (s) => s.row == seat.row && s.number == seat.number
        );
        if (seatIndex === -1) {
          throw new AppError(`Seat ${seat.row}${seat.number} not found`, 404);
        }

        if (showingSeats[seatIndex].occupied) {
          throw new AppError(
            `Seat ${seat.row}${seat.number} is already occupied`,
            400
          );
        }

        totalPrice += showingPrice[showingSeats[seatIndex].type];
        chosenSeats.push(showingSeats[seatIndex]);
      }

      return {
        showing_id: showing._id,
        seats: chosenSeats,
        total_price: totalPrice.toFixed(2),
      };
    } catch (error) {
      throw new AppError(error, 400);
    }
  }
}

module.exports = ShowingUtils;
