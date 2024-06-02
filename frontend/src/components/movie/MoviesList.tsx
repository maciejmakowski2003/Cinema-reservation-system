import Movie from "../../data/Movie"
import Showing from "../../data/Showing"
import { Grid, Container, TextField } from '@mui/material';
import MovieCard from './MovieCard';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from "../../config";
import { useEffect, useState } from "react";

const MoviesList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showings, setShowings] = useState<Showing[]>([])
    const [searchParams, _] = useSearchParams();
    const [date, setDate] = useState<Date | null>(new Date());
    const [cinemaId, setCinemaId] = useState<string | null>(null);

    const fetchMoviesAndShowings = async () => {
        const selectedDate = date?.toISOString().split('T')[0];
        const responses = await Promise.all([
            fetch(`${API_URL}/movies`),
            fetch(`${API_URL}/showings/cinema/${cinemaId}/date/${selectedDate}`)
        ])
        const moviesData = await responses[0].json();
        const showingsData = await responses[1].json();

        setMovies(moviesData);
        setShowings(showingsData);
    }

    useEffect(() => {
        if (!cinemaId || !date) return;
        fetchMoviesAndShowings()
    }, [cinemaId, date]);

    useEffect(() => {
        setCinemaId(searchParams.get('cinemaId'))
    }, [searchParams])

    return (
        <Container style={{
            paddingTop: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        }}>
            <TextField
                style={{
                    backgroundColor: 'white',
                }}
                id="date"
                type="date"
                defaultValue={date?.toISOString().split('T')[0]}
                sx={{ width: 220 }}
                onChange={(e) => setDate(new Date(e.target.value))}
            />
            <Grid container spacing={2} justifyContent="center">
                {movies.map((movie: Movie, index: number) => {
                    const movieShowings = showings.filter(s => s.cinema_id === cinemaId && s.movie_id === movie._id);
                    if (movieShowings.length === 0) return null;
                    return (
                        <Grid item key={index}>
                            <MovieCard movie={movie} showings={movieShowings} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    );
};

export default MoviesList;