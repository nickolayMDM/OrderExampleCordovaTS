import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import validators from "../../helpers/validators";
import errorHelpers from "../../helpers/error";

export interface FilterState {
    categoryID: number,
    searchQuery: string,
    page: number,
    limit: number
}

export interface DataState {
    filter: FilterState,
    list: Product[]
}

export type SetProductList = (action: Product[]) => void;

const initialState: DataState = {
    filter: {
        categoryID: null,
        searchQuery: null,
        page: 1,
        limit: 20,
    },
    list: []
};

const validate = {
    filter: (value: FilterState) => {
        validate.categoryID(value.categoryID);
        validate.page(value.page);
        validate.limit(value.limit);
    },
    categoryID: (value: number) => {
        if (!validators.isNonNegativeInteger(value) && !validators.isNull(value)) errorHelpers.throwError("product list category ID must be a non-negative integer or null");
    },
    page: (value: number) => {
        if (!validators.isPositiveInteger(value)) errorHelpers.throwError("product list page must be a positive integer");
    },
    limit: (value: number) => {
        if (!validators.isPositiveInteger(value)) errorHelpers.throwError("product list limit must be a positive integer");
    }
};

const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<FilterState>) {
            validate.filter(action.payload);

            state.filter = action.payload;
        },
        setCategoryID(state, action: PayloadAction<number>) {
            validate.categoryID(action.payload);

            state.filter.categoryID = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.filter.searchQuery = action.payload;
        },
        setPage(state, action: PayloadAction<number>) {
            validate.page(action.payload);

            state.filter.page = action.payload;
        },
        setLimit(state, action: PayloadAction<number>) {
            validate.limit(action.payload);

            state.filter.limit = action.payload;
        },
        revertFilterToDefault(state) {
            state.filter = initialState.filter;
        },
        revertListToDefault(state) {
            state.list = initialState.list;
        },
        setList(state, action: PayloadAction<Product[]>) {
            state.list = action.payload;
        }
    },
});

export const {setFilter, setCategoryID, setSearchQuery, setPage, setLimit, revertFilterToDefault, revertListToDefault, setList} = slice.actions;
export default slice.reducer;