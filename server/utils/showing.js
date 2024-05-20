const AppError = require('./error');

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
            const showing = await this.Showing.create({ cinema_id, movie_id, movie_name: movie.title, start_date, hall_id, price, format, seats: hall.seats });
            return showing;
        } catch (error) {
            throw new AppError(error, 400);
        }
    }

    generatePrice(standard, vip){
        return {
            "standard": standard, 
            "vip": vip
        };
    }

    generateFormat(type, language){
        return {
            "type": type, 
            "language": language
        };
    }


    async getShowingsByCinemaAndDate(cinema_id, date) {
        return await this.Showing.findByCinemaAndDate(cinema_id, date);
    }

    async getShowingsByCinemaMovieDate(cinema_id, movie_name, date) {
        const showings = await this.getShowingsByCinemaAndDate(cinema_id, date);
        return showings.filter(showing => showing.movie_name === movie_name);
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
            "hall_size": dict,
            "seats": showing.seats.sort((a, b) => a.row - b.row || a.number - b.number)
        }
    }
}

module.exports = ShowingUtils;