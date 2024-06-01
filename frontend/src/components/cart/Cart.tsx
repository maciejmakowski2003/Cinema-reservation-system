import * as React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const Cart: React.FC = () => {
    const totalPrice = calculateTotal(items);
    return (
        <div>
            <Typography variant="h6">
                Shopping Cart Summary
            </Typography>
            <List>
                {items.map((item) => (
                    <ListItem key={item.id}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity}, Subtotal: ${item.price * item.quantity}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6">
                Total Price: {totalPrice}
            </Typography>
        </div>
    );
}

export default Cart;