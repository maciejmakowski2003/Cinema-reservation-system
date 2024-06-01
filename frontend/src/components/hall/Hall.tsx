import SeatPicker from "../seat-picker/SeatPicker"
import { useParams } from "react-router-dom"
import "./hall.scss"
import Showing from "../../data/Showing"
import { API_URL } from "../../config"
import { useEffect, useState } from "react"
import useSeats from "../../providers/SeatProvider"
import Button from "@mui/material/Button"
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom"

const Hall = () => {
    const [showing, setShowing] = useState<Showing | null>(null)

    const theme = useTheme();
    const navigate = useNavigate()
    const { showingId } = useParams()
    const { selectedSeats, addToCart } = useSeats()

    const fetchShowing = async () => {
        const response = await fetch(`${API_URL}/showings/${showingId}`)
        const data = await response.json()
        setShowing(data)
    }

    const addToCartHandler = () => {
        if (!showingId) return
        addToCart(showingId, selectedSeats)
        navigate('/cart')
    }

    useEffect(() => {
        fetchShowing()
    }, [])

    return (
        <div id="hall">
            {showing && <SeatPicker showing={showing} />}
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <div id="legend" className="legend">
                    <h4>Legend</h4>
                    <div>
                        <div className="legend-row">
                            <div className="seat"></div>
                            <span>Availabe</span>
                        </div>
                        <div className="legend-row">
                            <div className="seat seat-occupied"></div>
                            <span>Occupied</span>
                        </div>

                        <div className="legend-row">
                            <div className="seat seat-selected"></div>
                            <span>Selected</span>
                        </div>
                    </div>
                </div>

                <div id="cartSummary" className="legend">
                    <h4>Koszyk</h4>
                    <div>
                        <span>Wybrane miejsca:</span>
                        <ul>
                            {selectedSeats.map(seat => (
                                <li>{seat.row}{seat.number}</li>
                            ))}
                        </ul>
                        <span>Do zapłaty: {(selectedSeats.length * showing?.price.standard).toFixed(2)} zł</span>

                        <Button
                            size='large'
                            style={{
                                fontWeight: 'bold',
                            }}
                            sx={{ my: 2, color: 'white', display: 'block', backgroundColor: theme.palette.primary.main, ":hover": { backgroundColor: theme.palette.primary.dark } }}
                            onClick={addToCartHandler}
                        >
                            Dodaj do koszyka
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Hall