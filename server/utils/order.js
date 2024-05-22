const AppError = require('./error');
const mongoose = require('mongoose');
const ShowingUtils = require('./showing');

class OrderUtils {
    constructor(Order, Showing, Movie, Hall, User) {
        this.Order = Order;
        this.Showing = Showing;
        this.Movie = Movie;
        this.Hall = Hall;
        this.User = User;
        this.showingUtils = new ShowingUtils(Showing, Movie, Hall);
    }

    async createOrder(user_id) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await this.User.findById(user_id).session(session);
            if(!user) {
                throw new AppError('User not found', 404);
            }

            const cart = user.cart;
            if(cart.showing_id === null || cart.seats.length === 0) {
                throw new AppError('Cart is empty', 400);
            }

            const showing = await this.Showing.findById(cart.showing_id).session(session);
            if(!showing) {
                throw new AppError('Showing not found', 404);
            }

            const {showing_id, seats, total_price} = await this.showingUtils.checkSeatsAvailability(showing, cart.seats);

            for(let seat of seats) {
                showing.seats.find(s => s.row == seat.row && s.number == seat.number).occupied = true;
            }

            await showing.save({session});

            await this.Order.create([{user_id, showing_id, tickets: seats, total_price}],{session: session});

            user.cart = {showing_id: null, seats: [], total_price: 0};
            await user.save({session});

            await session.commitTransaction();
            session.endSession();           
        } catch(error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(error, 400);
        }
    }

    async getUserOrders(user_id) {
        const orders = await this.Order.find({user_id}).sort({createdAt: -1}).exec();
        return orders;
    }

    async getCinemaMonthlyIncome(cinema_id, month, year) {
        const showings = await this.Showing.find({cinema_id}).exec();

        const firstDay = new Date(year, month -1, 1);
        firstDay.setHours(23, 59, 59, 9999);
        const lastDay = new Date(year, month, 1);
        lastDay.setHours(0,0,0,1);

        let income = 0;
        for (let showing of showings) {
            const orders = await this.Order.find({showing_id: showing._id, createdAt: { $gte: firstDay, $lt: lastDay } }).exec();
            for (let order of orders) {
                income += order.total_price;
            }
        }
        return income.toFixed(2);
    }

    async getCinemaMonthlyIncomeForEachMovie(cinema_id, month, year) {
        const showings = await this.Showing.find({cinema_id}).exec();

        const firstDay = new Date(year, month -1, 1);
        firstDay.setHours(23, 59, 59, 9999);
        const lastDay = new Date(year, month, 1);
        lastDay.setHours(0,0,0,1);

        let totalIncome = 0;
        let moviesIncome = {};
        for (let showing of showings) {
            const orders = await this.Order.find({showing_id: showing._id, createdAt: { $gte: firstDay, $lt: lastDay } }).exec();
            for (let order of orders) {
                if(!moviesIncome[showing.movie_name]) {
                    moviesIncome[showing.movie_name] = 0;
                }
                moviesIncome[showing.movie_name] += order.total_price;
                totalIncome += order.total_price;
            }
        }
        return {
            moviesIncome,
            totalIncome: totalIncome.toFixed(2),
        };
    }
}

module.exports = OrderUtils;