import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setModalName} from "../../redux/slices/modalSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import {setInCartTotal, setInCartTotalPrice} from "../../redux/slices/cartSlice";
import serverRequester from "../../adapters/serverRequesterAdapter";

import Button from "../commons/Button";

import "../../styles/ControlMenu/ConfirmOrder.scss";

export const ConfirmOrderPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

//TODO: add xstate
function ConfirmOrder(props: zod.infer<typeof ConfirmOrderPropsValidator>) {
    ConfirmOrderPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    let [displayed, setDisplayed] = React.useState(false);
    let tabName = useAppSelector((state) => state.tab.name);
    let inCartTotalPrice = useAppSelector((state) => state.cart.inCartTotalPrice);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate] = useTranslations(languageCode);

    React.useEffect(() => {
        if (tabName === "cart") {
            setDisplayed(true);
        } else {
            if (displayed === true) {
                setDisplayed(false);
            }
        }
    }, [tabName]);

    const getClassName = () => {
        let classNameString = "control-menu-popup order-confirm";
        if (!displayed) {
            classNameString += " hidden";
        }
        if (validators.isPopulatedString(props.className)) {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const clearCart = () => {
        serverRequester.clearCart();
        dispatch(setInCartTotal(0));
        dispatch(setInCartTotalPrice(0));
        dispatch(setTabName("menu"));
    };

    const onConfirm = () => {
        dispatch(setModalName("confirmOrder"));
    };

    return (
        <div className={getClassName()}>
            <div className="cart-total text-right">
                {translate("Total price: {price} UAH", "General", {"price": String(inCartTotalPrice)})}
            </div>
            <div className="cart-actions">
                <Button className="button-grey"
                        onClick={clearCart}>{translate("Cancel Order", "Actions")}</Button>
                <Button onClick={onConfirm}>{translate("Confirm Order", "Actions")}</Button>
            </div>
        </div>
    );
}

export default ConfirmOrder;