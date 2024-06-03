const AppError = require('./error');
const mongoose = require('mongoose');
const ShowingUtils = require('./showing');

class OrderUtils {
    constructor(Order, Showing, Movie, Hall, User, Cinema) {
        this.Order = Order;
        this.Showing = Showing;
        this.Movie = Movie;
        this.Hall = Hall;
        this.User = User;
        this.Cinema = Cinema;
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

    async getMonthlyIncomeForEachMovie(month, year) {
        const firstDay = new Date(year, month -1, 1);
        firstDay.setHours(23, 59, 59, 9999);
        const lastDay = new Date(year, month, 1);
        lastDay.setHours(0,0,0,1);

        try {
            const moviesIncome = await this.Movie.aggregate([
                {
                    $lookup: {
                    from: "showings",
                    localField: "_id",
                    foreignField: "movie_id",
                    as: "showing"
                    }
                },
                {
                    $unwind: "$showing"
                },
                {
                    $lookup: {
                    from: "orders",
                    localField: "showing._id",
                    foreignField: "showing_id",
                    as: "order"
                    }
                },
                {
                    $unwind: "$order"
                },
                {
                    $match: {
                        "order.createdAt": {
                            $gte: firstDay,
                            $lt: lastDay
                        }
                    }
                },
                {
                    $group: {
                    _id:  "$title", 
                    movieIncome: { $sum: "$order.total_price"}
                    }
                },
            ]);

            const totalIncome = moviesIncome.reduce((acc, movie) => acc + movie.movieIncome, 0);

            return {
                moviesIncome,
                totalIncome: totalIncome.toFixed(2),
            };
        } catch(error) {
            throw new AppError(error, 400);
        }
    }

    async getMonthlyNumberOfBookedTicketsForEachCinema(month, year) {
        const firstDay = new Date(year, month -1, 1);
        firstDay.setHours(23, 59, 59, 9999);
        const lastDay = new Date(year, month, 1);
        lastDay.setHours(0,0,0,1);

        console.log(firstDay, lastDay)

        try {
            const result = this.Cinema.aggregate([
                {
                    $lookup: {
                        from: "showings",
                        localField: "_id",
                        foreignField: "cinema_id",
                        as: "showing"
                    }
                },
                {
                    $unwind: "$showing"
                },
                {
                    $match: {
                        "showing.start_date": { $gte: firstDay, $lt: lastDay }
                    }
                },
                {
                    $project: {
                        cinemaName: "$name",
                        tickets: {
                            $size: {
                                $filter: {
                                    input: "$showing.seats",
                                    as: "seat",
                                    cond: { $eq: ["$$seat.occupied", true] }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$cinemaName",
                        bookedTickets: { $sum: "$tickets" }
                    }
                }
            ]);;

            return result;
        } catch(error) {
            throw new AppError(error, 400);
        }
    }
}

module.exports = OrderUtils;