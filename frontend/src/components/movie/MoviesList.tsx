import Movie from "../../data/Movie"
import Showing from "../../data/Showing"
import { Grid } from '@mui/material';
import MovieCard from './MovieCard';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from "../../config";
import { useEffect, useState } from "react";

const MoviesList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showings, setShowings] = useState<Showing[]>([])
    const [searchParams, setSearchParams] = useSearchParams();

    const [cinemaId, setCinemaId] = useState<string | null>(null);

    const fetchMoviesAndShowings = async () => {
        const responses = await Promise.all([
            fetch(`${API_URL}/movies`),
            fetch(`${API_URL}/showings`)
        ])
        const moviesData = await responses[0].json();
        const showingsData = await responses[1].json();
        setMovies(moviesData);
        setShowings(showingsData);
    }

    useEffect(() => {
        fetchMoviesAndShowings()
    }, []);

    useEffect(() => {
        setCinemaId(searchParams.get('cinemaId'))
    }, [searchParams])

    return (
        <Grid container spacing={2} justifyContent="center">
            {movies.map((movie: Movie, index: number) => (
                <Grid item key={index}>
                    <MovieCard movie={movie} showings={showings.filter(s => s.cinema_id === cinemaId && s.movie_id === movie._id)} />
                </Grid>
            ))}
        </Grid>
    );
};

export default MoviesList;
