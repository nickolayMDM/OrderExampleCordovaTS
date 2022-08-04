import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setSceneName} from "../../redux/slices/sceneSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import {revertFilterToDefault as revertProductFilterToDefault} from "../../redux/slices/productsSlice";
import {notify} from '../../adapters/notificationAdapter';

import Svg from "../commons/Svg";

import * as WishlistImage from "../../images/favourite.svg";

function WishlistButton() {
    const dispatch = useAppDispatch();

    let inWishlistTotal = useAppSelector((state) => state.wishlist.inWishlistTotal);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(languageCode);

    const openWishlistTab = () => {
        if (inWishlistTotal <= 0) {
            return notify.error(translate("Your wishlist is empty", "Errors"));
        }

        dispatch(setSceneName("productList"));
        dispatch(revertProductFilterToDefault());
        dispatch(setTabName("wishlist"));
    };

    return (
        <div className="wishlist-button" onClick={openWishlistTab}>
            <Svg src={WishlistImage.default} width={26} height={26}/>
            <p className="description-text">{translate("Wishlist", "General")}</p>
        </div>
    );
}

export default WishlistButton;