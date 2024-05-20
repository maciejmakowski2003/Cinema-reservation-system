const Showing = require('../models/showing');
const Movie = require('../models/movie');
const Hall = require('../models/hall');
const ShowingUtils = require('../utils/showing');
const showingUtils = new ShowingUtils(Showing, Movie, Hall);

const getShowingsByCinemaAndDate = async (req, res) => {
    try{
        const showings = await showingUtils.getShowingsByCinemaAndDate(req.params.cinema_id, req.params.date);
        res.status(200).json(showings);
    } catch(error){
        res.status(error.status || 400).json({ message: error.message });
    }
}

const getShowingsByCinemaMovieDate = async (req, res) => {
    try{
        const showings = await showingUtils.getShowingsByCinemaMovieDate(req.params.cinema_id, req.params.movie_name, req.params.date);
        res.status(200).json(showings);
    } catch(error){
        res.status(error.status || 400).json({ message: error.message });
    }
}

const getHallSizeByShowingId = async (req, res) => {
    try{
        const hallSize = await showingUtils.getHallSizeByShowingId(req.params.showing_id);
        res.status(200).json(hallSize);
    } catch(error){
        res.status(error.status || 400).json({ message: error.message });
    }
}

module.exports = { getShowingsByCinemaAndDate, getShowingsByCinemaMovieDate, getHallSizeByShowingId };