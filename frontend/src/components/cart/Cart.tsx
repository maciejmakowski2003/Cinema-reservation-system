import * as React from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button } from '@mui/material';
import CartItem from './CartItem';
import useCart from '../../providers/CartProvider';
import Seat from '../../data/Seat';
import axios from 'axios';
import { API_URL } from '../../config';
import Movie from '../../data/Movie';
import Showing from '../../data/Showing';

const Cart: React.FC = () => {
    const { cart, createOrder } = useCart()

    const [showing, setShowing] = React.useState<Showing | null>(null)
    const [movie, setMovie] = React.useState<Movie | null>(null)


    const fetchShowingAndMovie = async () => {
        const showingResponse = await axios.get(`${API_URL}/showings/${cart?.showing_id}`)
        const movie_id = showingResponse.data.movie_id
        const movieResponse = await axios.get(`${API_URL}/movies/${movie_id}`)
        setShowing(showingResponse.data)
        setMovie(movieResponse.data)
    }

    React.useEffect(() => {
        if (!cart) return;
        (async () => {
            await fetchShowingAndMovie()
        })()
    }, [cart])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                borderRadius: '20px',
                m: 2,
                minWidth: 300,
            }}
        >
            <Typography variant="h6" component="div" sx={{ margin: 0, padding: 0 }}>
                Shopping Cart Summary
            </Typography>
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Movie</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Seat number</TableCell>
                            <TableCell>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart?.seats.map((seat: Seat, index: number) => {
                            return <CartItem key={"seat" + index} seat={seat} movie={movie!} showing={showing!} />
                        })}
                    </TableBody>

                    <TableRow>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell align='right'>Total: </TableCell>
                        <TableCell>{cart?.total_price} zł</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={async () => {
                                    await createOrder()
                                }}
                            >ORDER
                            </Button>
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>

        </Box>
    );
}

export default Cart;