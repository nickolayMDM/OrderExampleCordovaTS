import {configureStore} from '@reduxjs/toolkit';

import accountReducer from "./slices/accountSlice";
import colorModeReducer from "./slices/colorModeSlice";
import modalReducer from "./slices/modalSlice";
import productsReducer from "./slices/productsSlice";
import sceneReducer from "./slices/sceneSlice";
import sideMenuReducer from "./slices/sideMenuSlice";
import languageReducer from "./slices/languageSlice";
import tabReducer from "./slices/tabSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
    reducer: {
        account: accountReducer,
        colorMode: colorModeReducer,
        modal: modalReducer,
        products: productsReducer,
        scene: sceneReducer,
        sideMenu: sideMenuReducer,
        language: languageReducer,
        tab: tabReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;