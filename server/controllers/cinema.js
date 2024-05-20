const Cinema = require('../models/cinema');

const getCinemas = async (req, res, next) => {
    try {
        const cinemas = await Cinema.find();
        res.status(200).json(cinemas);
    } catch (error) {
        next(error);
    }
}

module.exports = { getCinemas };