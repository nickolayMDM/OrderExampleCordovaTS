import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DataState {
    inWishlistTotal: number
}

const initialState: DataState = {
    inWishlistTotal: 0
};

const slice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        incrementInWishlistTotal(state) {
            state.inWishlistTotal++;
        },
        decrementInWishlistTotal(state) {
            state.inWishlistTotal--;
        },
        setInWishlistTotal(state, action: PayloadAction<number>) {
            state.inWishlistTotal = action.payload;
        },
        clearInWishlistTotal(state) {
            state.inWishlistTotal = initialState.inWishlistTotal;
        }
    },
});

export const { setInWishlistTotal, clearInWishlistTotal, incrementInWishlistTotal, decrementInWishlistTotal } = slice.actions;
export default slice.reducer;