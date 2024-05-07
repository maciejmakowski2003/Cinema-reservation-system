const AppError = require('../utils/error');

class CinemaUtils {
    constructor(Cinema, Showing) {
        this.Cinema = Cinema;
        this.Showing = Showing;
    }

    async createCinema(name, email, address, hours) {
        try {
            const opening_hours = this.generateOpeningHours(hours);
            const cinema = await this.Cinema.create({ name, email, address, opening_hours });
            return cinema;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async addHall(cinema_id, hall_id) {
        const cinema = await this.Cinema.findById(cinema_id);
        if (!cinema) {
            throw new AppError(`Cinema with id: ${cinema_id} not found`, 404);
        }

        cinema.halls.push(hall_id);
        await cinema.save();

        return cinema;
    }

    generateOpeningHours(hours) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const result = {};

        days.forEach(day => {
            result[day] = {
                open: hours.open,
                close: hours.close
            };
        });

        return result;
    }

    generateAddress(street, city, state, country, zipcode) {
        return {
            street,
            city,
            state,
            country,
            zipcode
        };
    }
}

module.exports = CinemaUtils;