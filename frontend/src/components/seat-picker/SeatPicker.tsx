import Seat from "../../data/Seat"
import Showing from "../../data/Showing"
import "./seatPicker.scss"
import useSeats from "../../providers/SeatProvider"

type Props = {
    showing: Showing

}

const SeatPicker = ({ showing }: Props) => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"]
    const columns = Array.from({ length: 20 }, (_, i) => i)
    // const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const { selectedSeats, setSelectedSeats } = useSeats()
    const selectSeat = (seat: Seat) => {
        setSelectedSeats([...selectedSeats, seat]);
    }

    const unselectSeat = (seat: Seat) => {
        setSelectedSeats(selectedSeats.filter(selectedSeat => !(selectedSeat.number === seat.number && selectedSeat.row === seat.row)));
    }

    const seatClickHandler = (seat: Seat) => {
        if (seat.occupied) return;
        if (selectedSeats.find(selectedSeat => selectedSeat.number == seat.number && selectedSeat.row === seat.row)) {
            unselectSeat(seat)
        }
        else {
            selectSeat(seat)
        }
    }

    return (
        <div id='seatPicker'>
            <div className="seats">
                <div id="screen"></div>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {columns.map((column, columnIndex) => {
                            const hasOffset = columnIndex === 15
                            const seatId = `${row}${column}`
                            const seat = showing.seats.find(seat => seat.row === row && seat.number == column)
                            const occupied = seat?.occupied
                            const selected = selectedSeats.find(selectedSeat => selectedSeat.number == column && selectedSeat.row === row)
                            const vip = seat?.type === "vip"
                            return <div
                                key={seatId} className={`seat ${hasOffset && 'seat-offset'} ${occupied && 'seat-occupied'} ${selected && 'seat-selected'}`}
                                onClick={() => seatClickHandler(seat!)}
                            >
                                <p>{seatId}{vip && <sup>&#9734;</sup>}</p>

                            </div>
                        })}
                    </div>
                ))}
            </div>


        </div>
    )
}

export default SeatPicker