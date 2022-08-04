import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";

export interface DataState {
    fullName: string,
    phone: string,
    address: string
}

const initialState: DataState = {
    fullName: "",
    phone: "",
    address: ""
};

const validate = {
    phone: (value: string) => {
        if(!validators.isUAPhone(value)) errorHelpers.throwError("phone must be a ukrainian phone number");
    },
    state: (value: DataState) => {
        validate.phone(value.phone);
    }
};

const slice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setState(state, action: PayloadAction<DataState>) {
            validate.state(action.payload);

            state = action.payload;
        },
        setFullName(state, action: PayloadAction<string>) {
            state.fullName = action.payload;
        },
        setPhone(state, action: PayloadAction<string>) {
            validate.phone(action.payload);

            state.phone = action.payload;
        },
        setAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        revertToDefault(state) {
            state = initialState;
        }
    },
});

export const { setState, setFullName, setPhone, setAddress, revertToDefault } = slice.actions;
export default slice.reducer;