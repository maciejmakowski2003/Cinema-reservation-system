import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Movie from '../../data/Movie';
import Showing from '../../data/Showing';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
type Props = {
    movie: Movie
    showings: Showing[]
}

const MovieCard: React.FC<Props> = ({ movie, showings }) => {
    return (
        <Card sx={{
            width: 250,
            minHeight: 400,
            m: 2
        }}>
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
            }}>
                <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {movie.genre ?? "Brak gatunku"} | {movie.runtime} min
                </Typography>
                <br />
                <div>
                    {showings.map((showing: Showing) => {
                        const hour = new Date(showing.start_date).getHours();
                        const minutes = new Date(showing.start_date).getMinutes() < 10 ? `0${new Date(showing.start_date).getMinutes()}` : new Date(showing.start_date).getMinutes();
                        return <Link to={`/showings/${showing._id}`}><Chip label={`${hour}:${minutes}`} sx={{
                            margin: "5px",
                        }}
                            clickable={true}
                        /></Link>
                    })}
                </div>
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
