import React from "react";
import Seat from "../data/Seat";

interface SeatContextState {
    seats: Seat[];
    selectedSeats: Seat[];
    selectSeat: (seat: Seat) => void;
    unselectSeat: (seat: Seat) => void;
}

const SeatContext = React.createContext<SeatContextState | undefined>(undefined);

const SeatPickerProvider: React.FC = ({ children }) => {
    const [seats, setSeats] = React.useState<Seat[]>([
        {
            row: "A",
            number: 1,
            occupied: false,
            type: "standard"
        },
        {
            row: "A",
            number: 2,
            occupied: false,
            type: "vip"
        },
        {
            row: "A",
            number: 3,
            occupied: true,
            type: "standard"
        },
        {
            row: "A",
            number: 4,
            occupied: true,
            type: "vip"
        },
        {
            row: "M",
            number: 14,
            occupied: true,
            type: "vip"
        }
    ]);
    const [selectedSeats, setSelectedSeats] = React.useState<Seat[]>([]);

    React.useEffect(() => {

    }, []);

    const selectSeat = (seat: Seat) => {
        setSelectedSeats([...selectedSeats, seat]);
    }

    const unselectSeat = (seat: Seat) => {
        setSelectedSeats(selectedSeats.filter(selectedSeat => !(selectedSeat.number === seat.number && selectedSeat.row === seat.row)));
    }

    return (
        <SeatContext.Provider value={{ seats, selectedSeats, selectSeat, unselectSeat }}>
            {children}
        </SeatContext.Provider>
    );
};
const useSeats = () => {
    const context = React.useContext(SeatContext);

    if (context === undefined) {
        throw new Error('useSeats must be used within a SeatPickerProvider');
    }

    return context;
};

export default useSeats;

export { SeatPickerProvider, useSeats };