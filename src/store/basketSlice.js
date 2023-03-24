import {createSlice} from "@reduxjs/toolkit";

const basketSlice = createSlice({
    name: "basket",
    initialState: {cartItems: [], totalAmount: 0, totalPrice: 0},
    reducers: {
        setBasket(state,action){
            return state=action.payload
        },
        addBasket(state, action) {
            const cartItem = state.cartItems.find(item => item.id === action.payload.id);
            if (cartItem && cartItem.colors["name-en"]===action.payload.colors["name-en"]){
                cartItem.amount = cartItem.amount+action.payload.amount || cartItem.amount + 1;
            }
            else state.cartItems.push(action.payload)
        },
        removeBasket(state, action) {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        },
        increment(state, action) {
            const cartItem = state.cartItems.find(item => item.id === action.payload);
            cartItem.amount = cartItem.amount + 1;
        },
        decrement(state, action) {
            const cartItem = state.cartItems.find(item => item.id === action.payload);
            if(cartItem.amount===1){
                state.cartItems = state.cartItems.filter(item => item.id !== action.payload)
            }
            if (cartItem.amount > 1) {
                cartItem.amount = cartItem.amount - 1;
            }
        },
        calculate(state) {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price.amount;
            });
            state.totalAmount = amount;
            state.totalPrice = total;
            localStorage.setItem("orders",JSON.stringify(state))
        },
        clearCart(state) {
            state.cartItems = [];
        }
    }
})

export const {addBasket, calculate, clearCart, removeBasket, decrement, increment,setBasket} = basketSlice.actions

export default basketSlice.reducer



