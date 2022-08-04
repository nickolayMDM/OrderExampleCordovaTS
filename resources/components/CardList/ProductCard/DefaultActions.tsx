import * as React from 'react';
import * as zod from "zod";
import {useAppSelector, useAppDispatch} from "../../../redux/hooks";
import {useTranslations} from "../../../adapters/translatorAdapter";
import {incrementInWishlistTotal, decrementInWishlistTotal} from "../../../redux/slices/wishlistSlice";
import {increaseInCartTotal, increaseInCartTotalPrice} from "../../../redux/slices/cartSlice";
import serverRequester from "../../../adapters/serverRequesterAdapter";
import useProductListUpdate from "../../../hooks/useProductListUpdate";

import Svg from "../../commons/Svg";
import Button from "../../commons/Button";

import * as AddFavouriteSvg from "../../../images/addfavourite.svg";
import * as UnfavouriteSvg from "../../../images/unfavourite.svg";

export const DefaultActionsPropsValidator = zod.object({
    ID: zod.number().int().nonnegative(),
    inWishlist: zod.boolean(),
    productPrice: zod.number().nonnegative()
});

function DefaultActions(props: zod.infer<typeof DefaultActionsPropsValidator>) {
    DefaultActionsPropsValidator.parse(props);

    const dispatch = useAppDispatch();
    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(localeCode);
    const productListUpdate = useProductListUpdate();

    const addToCart = async () => {
        serverRequester.addToCart(props.ID);
        await productListUpdate();

        dispatch(increaseInCartTotal(1));
        dispatch(increaseInCartTotalPrice(props.productPrice));
    };

    const addToWishlist = async () => {
        serverRequester.addToWishlist(props.ID);
        await productListUpdate();

        dispatch(incrementInWishlistTotal());
    };

    const removeFromWishlist = async () => {
        serverRequester.removeFromWishlist(props.ID);
        await productListUpdate();

        dispatch(decrementInWishlistTotal());
    };

    const renderWishlistAction = () => {
        if (!props.inWishlist) {
            return (
                <Button className="button-link button-link-danger wishlist-button"
                        onClick={addToWishlist}>
                    <Svg src={AddFavouriteSvg.default} className="svg-danger" width={24} height={24}/>
                </Button>
            );
        }

        return (
            <Button className="button-link button-link-black wishlist-button"
                    onClick={removeFromWishlist}>
                <Svg src={UnfavouriteSvg.default} width={24} height={24}/>
            </Button>
        );
    };

    return (
        <div className="actions">
            <Button className="button-thin" onClick={addToCart}>
                {translate("Add to Cart", "Actions")}
            </Button>
            {renderWishlistAction()}
        </div>
    );
}

export default DefaultActions;