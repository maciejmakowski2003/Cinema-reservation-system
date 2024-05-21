const {createToken} = require('../utils/token');
const AppError = require('../utils/error');
const mongoose = require('mongoose');

class UserUtils {
    constructor(User, Showing) {
        this.User = User;
        this.Showing = Showing;
    }

    async signup(email, password) {
        try {
            const user = await this.User.create({ email, password });
            return {
                user,
                token: createToken(user)
            };
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async login(email, password) {
        const user = await this.User.findOne({ email }).select('+password');
        if (!user) throw new AppError('User not found', 404);
        if (!(await user.isValidPassword(password))) throw new AppError('Invalid email or password', 401);

        return {
            user,
            token: createToken(user)
        };
    }

    async updatePassword(user_id, oldPassword, newPassword) {
        const user = await this.User.findById(user_id);
        if (!user) {
            throw new AppError(`User with id: ${user_id} not found`, 404);
        }
        if (!(await user.isValidPassword(oldPassword))) {
            throw new AppError('Invalid password', 401);
        }

        user.password = newPassword;
        await user.save();

        return {
            token: createToken(user)
        };
    }

    async getCart(user_id) {
        console.log(user_id);
        const user = await this.User.findById(user_id).select('cart');
        if (!user) {
            throw new AppError(`User with id: ${user_id} not found`, 404);
        }

        return user.cart;
    }

    async addToCart(user_id, showing_id, seats) {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const user = await this.User.findById(user_id).session(session);
            if (!user) {
                throw new AppError(`User with id: ${user_id} not found`, 404);
            }
    
            const showing = await this.Showing.findById(showing_id).session(session);
            if (!showing) {
                throw new AppError(`Showing with id: ${showing_id} not found`, 404);
            }
    
            const showingSeats = showing.seats;
    
            for (let seat of seats) {
                const seatIndex = showingSeats.findIndex(s => s.row == seat.row && s.number == seat.number);
                if (seatIndex === -1) {
                    throw new AppError(`Seat ${seat.row}${seat.number} not found`, 404);
                }
    
                if (showingSeats[seatIndex].occupied) {
                    throw new AppError(`Seat ${seat.row}${seat.number} is already occupied`, 400);
                }
            }

            user.cart = {};
    
            user.cart = { showing_id, seats,  };
            await user.save({ session });
    
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError(error, 400);
        }
    }
}

module.exports = UserUtils;