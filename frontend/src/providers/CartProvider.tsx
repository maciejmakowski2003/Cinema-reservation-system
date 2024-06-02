import axios from 'axios';
import { API_URL } from '../config';
import useAuth from './AuthProvider';
import Seat from "../data/Seat";
import { createContext, useContext, useEffect, useState } from 'react';
import useSnackbar from './SnackbarProvider';

type Props = {
    children: React.ReactNode;
}

interface CartContextState {
    cart: Cart | null;
    setCart: (cart: Cart | null) => void;
    addToCart: (showing_id: string, seats: Seat[]) => Promise<void>;
    createOrder: () => Promise<void>;
}

interface Cart {
    showing_id: string;
    seats: Seat[];
    total_price: number;
}

const CartContext = createContext<CartContextState | undefined>(undefined);

const CartProvider = ({ children }: Props) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const { user } = useAuth();
    const { setText } = useSnackbar();

    const addToCart = async (showing_id: string, seats: Seat[]) => {
        const response = await axios.post(`${API_URL}/users/cart`, {
            showing_id,
            seats
        }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status !== 200) return
        await fetchCart()
    }

    const fetchCart = async () => {
        const response = await axios.get(`${API_URL}/users/cart`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status !== 200) return
        setCart(response.data)
    }

    const createOrder = async () => {
        const response = await axios.post(`${API_URL}/orders`, {}, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status !== 201) return
        setText("Order created!")
        await fetchCart()
    }

    useEffect(() => {
        if (!user) return
        (async () => {
            await fetchCart()
        })()
    }, [user])

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, createOrder }}>
            {children}
        </CartContext.Provider>
    );
};
const useCart = () => {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

export default useCart;

export { CartProvider, useCart };