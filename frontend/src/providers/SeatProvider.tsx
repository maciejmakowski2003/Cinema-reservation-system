import React from "react";
import Seat from "../data/Seat";

interface SeatContextState {
    selectedSeats: Seat[];
    setSelectedSeats: (selectedSeats: Seat[]) => void;
    cartItems: CartItem[];
    setCartItems: (cartItems: CartItem[]) => void;
    addToCart: (showing_id: string, seats: Seat[]) => void;
}

interface CartItem {
    showing_id: string;
    seats: Seat[];
}

const SeatContext = React.createContext<SeatContextState | undefined>(undefined);

const SeatPickerProvider: React.FC = ({ children }) => {

    const [selectedSeats, setSelectedSeats] = React.useState<Seat[]>([]);
    const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

    const addToCart = (showing_id: string, seats: Seat[]) => {
        const newCartItem = { showing_id, seats };
        setCartItems([...cartItems, newCartItem]);
    }

    return (
        <SeatContext.Provider value={{ selectedSeats, setSelectedSeats, cartItems, setCartItems, addToCart }}>
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