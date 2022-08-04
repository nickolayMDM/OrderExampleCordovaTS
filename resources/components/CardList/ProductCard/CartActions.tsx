import * as React from 'react';
import * as zod from "zod";
import {useAppDispatch} from "../../../redux/hooks";
import serverRequester from "../../../adapters/serverRequesterAdapter";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import {setName as setSceneName} from "../../../redux/slices/sceneSlice";
import {setName as setTabName} from "../../../redux/slices/tabSlice";
import {setInCartTotal, setInCartTotalPrice} from "../../../redux/slices/cartSlice";
import {revertFilterToDefault as revertProductFilterToDefault} from "../../../redux/slices/productsSlice";

export const CartActionsPropsValidator = zod.object({
    ID: zod.number().int().nonnegative(),
    inCart: zod.number().nonnegative()
});

function CartActions(props: zod.infer<typeof CartActionsPropsValidator>) {
    CartActionsPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    const addToCart = () => {
        serverRequester.addToCart(props.ID);
        dispatch(setInCartTotal(serverRequester.getInCartTotal()));
        dispatch(setInCartTotalPrice(serverRequester.getInCartTotalPrice()));
    };

    const reduceInCart = () => {
        serverRequester.reduceInCart(props.ID);
        let currentInCartTotal = serverRequester.getInCartTotal();
        dispatch(setInCartTotal(currentInCartTotal));
        dispatch(setInCartTotalPrice(serverRequester.getInCartTotalPrice()));

        if (currentInCartTotal <= 0) {
            switchToMenu();
        }
    };

    const removeFromCart = () => {
        serverRequester.removeFromCart(props.ID);
        let currentInCartTotal = serverRequester.getInCartTotal();
        dispatch(setInCartTotal(currentInCartTotal));
        dispatch(setInCartTotalPrice(serverRequester.getInCartTotalPrice()));

        if (currentInCartTotal <= 0) {
            switchToMenu();
        }
    };

    const switchToMenu = () => {
        dispatch(setSceneName("productList"));
        dispatch(revertProductFilterToDefault());
        dispatch(setTabName("menu"));
    };

    return (
        <div className="actions cart-actions">
            <FontAwesomeIcon onClick={removeFromCart} icon={faTimes}/>
            <div className="cart-actions-details">
                <FontAwesomeIcon onClick={reduceInCart} icon={faMinus}/>
                <div>{props.inCart}</div>
                <FontAwesomeIcon onClick={addToCart} icon={faPlus}/>
            </div>
        </div>
    );
}

export default CartActions;