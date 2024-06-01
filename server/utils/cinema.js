const AppError = require('./error');
const mongoose = require('mongoose');
const HallUtils = require('./hall');

class CinemaUtils {
    constructor(Cinema, Showing, Hall) {
        this.Cinema = Cinema;
        this.Showing = Showing;
        this.Hall = Hall;
        this.hallUtils = new HallUtils(Hall);
    }

    async createCinema(name, email, address, hours) {
        try {
            const opening_hours = this.generateOpeningHours(hours);
            const cinema = await this.Cinema.create({ name, email, address, opening_hours });
            return cinema;
        } catch (error) {
            throw new AppError(error, 400);
        }
    }

    async createAndAddHall(name, cinema_id, rows, seatsPerRow) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newHall = await this.hallUtils.createHall(name, cinema_id, rows, seatsPerRow);
            const savedHall = await newHall.save({ session });

            await this.Cinema.findByIdAndUpdate(
                cinema_id,
                { $push: { halls: savedHall._id } },
                { new: true, session }
            );

            await session.commitTransaction();
            session.endSession();
        } catch(error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(error, 400);
        }
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