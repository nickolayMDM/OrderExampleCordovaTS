import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setSceneName, setName as setModalName} from "../../redux/slices/sceneSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import {revertFilterToDefault as revertProductFilterToDefault} from "../../redux/slices/productsSlice";
import {notify} from '../../adapters/notificationAdapter';

import Svg from "../commons/Svg";

import * as CartImage from "../../images/cart.svg";

function CartButton() {
    const dispatch = useAppDispatch();

    let inCartTotal = useAppSelector((state) => state.cart.inCartTotal);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate] = useTranslations(languageCode);

    const openCartTab = async () => {
        if (inCartTotal <= 0) {
            return notify.error(translate("Your cart is empty", "Errors"));
        }

        dispatch(setSceneName("productList"));
        dispatch(revertProductFilterToDefault());
        dispatch(setTabName("cart"));
    };

    const renderInCartTotalNumber = () => {
        if (inCartTotal <= 0) {
            return "";
        }

        return (<div className="in-cart-total">
            {inCartTotal}
        </div>);
    };

    return (
        <div className="cart-button" onClick={openCartTab}>
            <Svg src={CartImage.default} width={50} height={50}/>
            <p className="description-text">{translate("Cart", "General")}</p>
            {renderInCartTotalNumber()}
        </div>
    );
}

export default CartButton;