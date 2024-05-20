const AppError = require('./error');

class HallsUtils {
    constructor(Hall) {
        this.Hall = Hall;
    }

    async createHall(name, cinema_id, rows, seatsPerRow) {
        try {
            const seats = this.generateSeats(rows, seatsPerRow);
            const hall = new this.Hall({
                name,
                cinema_id,
                seats,
            });
            return hall;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    generateSeats(rows, seatsPerRow) {
        const seats = [];
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < seatsPerRow[i]; j++) {
                seats.push({
                    row: letters[i],
                    number: j,
                });
            }
        }
        return seats;
    }

    async changeSeatType(hall_id, row, number, type) {
        try {
            const hall = await this.Hall.findById(hall_id);
            const seat = hall.seats.find(seat => seat.row == row && seat.number == number);
            seat.type = type;
            await hall.save();
        } catch (error) {
            throw new AppError(error, 400);
        }
    }
}

module.exports = HallsUtils;