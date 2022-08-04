import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {defaultLocaleCode} from "../../config";
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";

export interface DataState {
    localeCode: string
}

const initialState: DataState = {
    localeCode: defaultLocaleCode
};

const validate = {
    localeCode: (value: string) => {
        if (!validators.isLocaleCode(value)) errorHelpers.throwError("locale code must have an ISO format");
    }
};

const slice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLocaleCode(state, action: PayloadAction<string>) {
            validate.localeCode(action.payload);

            state.localeCode = action.payload;
        },
        revertToDefault(state) {
            state = initialState;
        }
    },
});

export const {setLocaleCode, revertToDefault} = slice.actions;
export default slice.reducer;