import * as productsMock from "../../serverMock/products";
import * as usersMock from "../../serverMock/users";
import * as categoriesMock from "../../serverMock/categories";
import validators from "../helpers/validators";

import getProductsPage from "./serverRequester/getProductPage";

const errorPrefix = "serverRequester: ";

const getUserByID = async (
    {
        userID
    }: {
        userID: number
    }
) => {
    if (!validators.isPositiveInteger(userID)) {
        throw Error(errorPrefix + "user ID must be a positive integer");
    }

    return usersMock.getUserByID(userID);
};

const getCategories = () => {
    return categoriesMock.getAll();
};

const addToWishlist = (ID: number) => {
    productsMock.addToWishlist(ID);
};

const removeFromWishlist = (ID: number) => {
    productsMock.removeFromWishlist(ID);
};

const addToCart = (ID: number) => {
    productsMock.addToCart(ID);
};

const reduceInCart = (ID: number) => {
    productsMock.reduceInCart(ID);
};

const removeFromCart = (ID: number) => {
    productsMock.removeFromCart(ID);
};

const clearCart = () => {
    productsMock.clearCart();
};

const getInCartTotal = () => {
    return productsMock.getInCartTotal();
};

const getInCartTotalPrice = () => {
    return productsMock.getInCartTotalPrice();
};

const getInWishlistTotal = () => {
    return productsMock.getInWishlistTotal();
};

export default {
    getUserByID,
    getProductsPage,
    getCategories,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    reduceInCart,
    removeFromCart,
    clearCart,
    getInCartTotal,
    getInCartTotalPrice,
    getInWishlistTotal
};