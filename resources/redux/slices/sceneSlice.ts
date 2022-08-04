import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";

export interface DataState {
    name: string,
    availableSceneNames: string[]
}

const initialState: DataState = {
    name: null,
    availableSceneNames: []
};

const validate = {
    name: (state: DataState, value: string) => {
        if(!validators.isWithinArray<string>(value, state.availableSceneNames) && validators.isPopulatedString(value)) errorHelpers.throwError("scene name must be one of the available values");
    }
};

const slice = createSlice({
    name: 'scene',
    initialState,
    reducers: {
        setName(state, action: PayloadAction<string>) {
            validate.name(state, action.payload);

            state.name = action.payload;
        },
        addAvailableName(state, action: PayloadAction<string>) {
            state.availableSceneNames.push(action.payload);
        },
        removeAvailableName(state, action: PayloadAction<string>) {
            const index = state.availableSceneNames.indexOf(action.payload);
            if (index === -1) return;

            state.availableSceneNames.splice(index, 1);
        },
        revertNameToDefault(state) {
            state.name = initialState.name;
        }
    },
});

export const { setName, addAvailableName, removeAvailableName, revertNameToDefault } = slice.actions;
export default slice.reducer;