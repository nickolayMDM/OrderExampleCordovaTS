import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface DataState {
    inCartTotal: number,
    inCartTotalPrice: number
}

const initialState: DataState = {
    inCartTotal: 0,
    inCartTotalPrice: 0
};

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increaseInCartTotal(state, action: PayloadAction<number>) {
            state.inCartTotal += action.payload;
        },
        decreaseInCartTotal(state, action: PayloadAction<number>) {
            state.inCartTotal -= action.payload;
        },
        setInCartTotal(state, action: PayloadAction<number>) {
            state.inCartTotal = action.payload;
        },
        clearInCartTotal(state) {
            state.inCartTotal = initialState.inCartTotal;
        },
        increaseInCartTotalPrice(state, action: PayloadAction<number>) {
            state.inCartTotalPrice += action.payload;
        },
        decreaseInCartTotalPrice(state, action: PayloadAction<number>) {
            state.inCartTotalPrice -= action.payload;
        },
        setInCartTotalPrice(state, action: PayloadAction<number>) {
            state.inCartTotalPrice = action.payload;
        },
        clearInCartTotalPrice(state) {
            state.inCartTotalPrice = initialState.inCartTotalPrice;
        }
    },
});

export const {
    setInCartTotal,
    clearInCartTotal,
    setInCartTotalPrice,
    clearInCartTotalPrice,
    increaseInCartTotal,
    decreaseInCartTotal,
    increaseInCartTotalPrice,
    decreaseInCartTotalPrice
} = slice.actions;
export default slice.reducer;