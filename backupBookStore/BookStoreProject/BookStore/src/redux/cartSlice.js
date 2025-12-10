import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.bookId === newItem.bookId);

            if (existingItem) {
                // item already exists, just increment
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            } else {
                // new item
                state.items.push({
                    bookId: newItem.bookId,
                    title: newItem.title,
                    price: newItem.price,
                    imageUrl: newItem.imageUrl || newItem.ImageUrl,
                    quantity: 1,
                    totalPrice: newItem.price
                });
            }
            state.totalAmount += newItem.price;
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.bookId === id);
            if (existingItem) {
                state.items = state.items.filter(item => item.bookId !== id);
                state.totalAmount -= existingItem.totalPrice;
            }
        },
        
        increaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.bookId === id);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += existingItem.price;
                state.totalAmount += existingItem.price;
            }
        },
        
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.bookId === id);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
                state.totalAmount -= existingItem.price;
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        }
    }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;