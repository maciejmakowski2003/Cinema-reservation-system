import { TableCell, TableRow, } from '@mui/material';
import Showing from '../../data/Showing';
import Movie from '../../data/Movie';
import Seat from '../../data/Seat';
import { formatDate } from '../../utils';
type Props = {
    seat: Seat;
    movie: Movie;
    showing: Showing;
}

const CartItem = ({
    seat,
    movie,
    showing,
}: Props) => {

    return (
        movie && showing && <TableRow>
            <TableCell>
                {movie.title}
            </TableCell>
            <TableCell>{formatDate(showing.start_date.toString())}</TableCell>
            <TableCell align='center'>{seat.row + seat.number}</TableCell>
            <TableCell>{seat.type}</TableCell>
        </TableRow>
    )
}

export default CartItem