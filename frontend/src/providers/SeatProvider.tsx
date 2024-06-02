import React from "react";
import Seat from "../data/Seat";

interface SeatContextState {
    selectedSeats: Seat[];
    setSelectedSeats: (selectedSeats: Seat[]) => void;

}

type Props = {
    children: React.ReactNode;
}
const SeatContext = React.createContext<SeatContextState | undefined>(undefined);

const SeatPickerProvider = ({ children }: Props) => {
    const [selectedSeats, setSelectedSeats] = React.useState<Seat[]>([]);


    return (
        <SeatContext.Provider value={{ selectedSeats, setSelectedSeats, }}>
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