import Cinema from "../../data/Cinema"
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import CinemaCard from "./CinemaCard";

const CinemasList = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    const fetchCinemas = async () => {
        const response = await fetch(`${API_URL}/cinemas`)
        const data = await response.json();
        setCinemas(data);
    }

    useEffect(() => {
        fetchCinemas();
    }, []);

    return (
        <Grid container spacing={2} justifyContent="center">
            {cinemas.map((cinema: Cinema, index: number) => (
                <Grid item key={index}>
                    <Link to={`/movies?cinemaId=${cinema._id}`} style={{
                        textDecoration: 'none',
                    }}>

                        <CinemaCard cinema={cinema} /> </Link>
                </Grid>
            ))}
        </Grid>
    );
};

export default CinemasList;
