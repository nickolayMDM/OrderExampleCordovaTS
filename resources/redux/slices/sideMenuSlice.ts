import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";

export interface DataState {
    openMenuName: string,
    activeLeftMenuName: string,
    activeRightMenuName: string,
    availableMenuNames: string[]
}

const initialState: DataState = {
    openMenuName: null,
    activeLeftMenuName: null,
    activeRightMenuName: null,
    availableMenuNames: []
};

const validate = {
    openMenuName: (state: DataState, value: string) => {
        if(!validators.isWithinArray<string>(value, state.availableMenuNames) && validators.isPopulatedString(value)) errorHelpers.throwError("open side menu name must be one of the available values");
    },
    activeLeftMenuName: (state: DataState, value: string) => {
        if((!validators.isWithinArray<string>(value, state.availableMenuNames) || value === state.activeRightMenuName) && validators.isPopulatedString(value)) errorHelpers.throwError("active left side menu name invalid value");
    },
    activeRightMenuName: (state: DataState, value: string) => {
        if((!validators.isWithinArray<string>(value, state.availableMenuNames) || value === state.activeLeftMenuName) && validators.isPopulatedString(value)) errorHelpers.throwError("active right side menu name invalid value");
    }
};

const slice = createSlice({
    name: 'sideMenu',
    initialState,
    reducers: {
        setOpenName(state, action: PayloadAction<string>) {
            validate.openMenuName(state, action.payload);

            state.openMenuName = action.payload;
        },
        setActiveLeftMenuName(state, action: PayloadAction<string>) {
            validate.activeLeftMenuName(state, action.payload);

            state.activeLeftMenuName = action.payload;
        },
        setActiveRightMenuName(state, action: PayloadAction<string>) {
            validate.activeRightMenuName(state, action.payload);

            state.activeRightMenuName = action.payload;
        },
        addAvailableName(state, action: PayloadAction<string>) {
            state.availableMenuNames.push(action.payload);
        },
        removeAvailableName(state, action: PayloadAction<string>) {
            const index = state.availableMenuNames.indexOf(action.payload);
            if (index === -1) return;

            state.availableMenuNames.splice(index, 1);
        },
        revertNamesToDefault(state) {
            state.openMenuName = initialState.openMenuName;
            state.activeLeftMenuName = initialState.activeLeftMenuName;
            state.activeRightMenuName = initialState.activeRightMenuName;
        }
    },
});

export const { setOpenName, setActiveLeftMenuName, setActiveRightMenuName, addAvailableName, removeAvailableName, revertNamesToDefault } = slice.actions;
export default slice.reducer;