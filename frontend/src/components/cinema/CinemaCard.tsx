import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Cinema from '../../data/Cinema';

type Props = {
    cinema: Cinema
}

const CinemaCard: React.FC<Props> = ({ cinema }) => {
    return (
        <Card sx={{ width: 250, height: 400, m: 2 }}>
            <CardMedia
                component="img"
                image={cinema.imageSrc}
                alt={cinema.name}
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
                    {cinema.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {cinema.email}
                </Typography>

            </CardContent>
        </Card>
    );
};

export default CinemaCard;
