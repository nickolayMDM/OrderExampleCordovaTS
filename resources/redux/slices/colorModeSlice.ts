import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";
import { defaultColorModeName, availableColorModeNames } from "../../config";

export interface DataState {
    name: string
}

const initialState: DataState = {
    name: defaultColorModeName
};

const validate = {
    name: (value: string) => {
        if(!validators.isWithinArray<string>(value, availableColorModeNames)) errorHelpers.throwError("color mode name must be one of the available values");
    }
};

const slice = createSlice({
    name: 'colorMode',
    initialState,
    reducers: {
        setName(state, action: PayloadAction<string>) {
            validate.name(action.payload);

            state.name = action.payload;
        },
        revertToDefault(state) {
            state = initialState;
        }
    },
});

export const { setName, revertToDefault } = slice.actions;
export default slice.reducer;