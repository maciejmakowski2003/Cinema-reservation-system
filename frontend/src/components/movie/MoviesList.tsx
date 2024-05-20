import Movie from "../../data/Movie"
import { Grid } from '@mui/material';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';

const sampleMovies: Movie[] = [
    {
        _id: "23232",
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        runtime: 148,
        genre: "Sci-Fi, Thriller",
        imageSrc: "https://fwcdn.pl/fpo/08/91/500891/7354571.3.jpg"
    },
    {
        _id: "23232323233",
        title: "The Shawshank Redemption",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        runtime: 142,
        genre: "Drama",
        imageSrc: "https://m.media-amazon.com/images/I/815qtzaP9iL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        _id: "232sdfsdfsdfsdfsg33232323",
        title: "The Matrix",
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        runtime: 136,
        genre: "Action, Sci-Fi",
        imageSrc: "https://fwcdn.pl/fpo/06/28/628/7685907_1.6.jpg"
    }
];


const MoviesList = () => {
    return (
        <Grid container spacing={2} justifyContent="center">
            {sampleMovies.map((movie: Movie, index: number) => (
                <Grid item key={index}>
                    <Link to={`/movies/${movie._id}`} style={{
                        textDecoration: 'none',
                    }}>

                        <MovieCard movie={movie} /> </Link>
                </Grid>
            ))}
        </Grid>
    );
};

export default MoviesList;
