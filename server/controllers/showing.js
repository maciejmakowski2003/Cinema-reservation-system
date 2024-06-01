const Showing = require('../models/showing');
const AppError = require('../utils/error');

const getShowing = async (req, res) => {
    try {
        const { showingId } = req.params;
        const showing = await Showing.findById({
            _id: showingId,
        });
        res.status(200).json(showing);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
}

const getShowings = async (req, res) => {
    try {
        const showings = await Showing.find();
        res.status(200).json(showings);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
}


module.exports = { getShowings, getShowing };