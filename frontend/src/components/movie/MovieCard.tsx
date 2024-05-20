import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Movie from '../../data/Movie';

type MovieProps = {
    movie: Movie
}

const MovieCard: React.FC<MovieProps> = ({ movie }) => {
    return (
        <Card sx={{ width: 250, height: 400, m: 2 }}>
            <CardMedia
                component="img"
                image={movie.imageSrc}
                alt={movie.title}
                sx={{
                    height: 280
                }}
            />
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 90
            }}>
                <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {movie.genre} | {movie.runtime} min
                </Typography>
                {/* {movie.showings.map((showing: Showing, index: number) => (
                    <Stack key={index} direction="row" spacing={1} mt={1}>
                        <Chip label={new Date(showing.start_date).toLocaleString()} color="primary" />
                        <Chip label={`${showing.format.type} (${showing.format.language})`} color="secondary" />
                        <Chip label={`$${showing.price.standard} - $${showing.price.vip}`} />
                    </Stack>
                ))} */}
            </CardContent>
        </Card>
    );
};

export default MovieCard;
