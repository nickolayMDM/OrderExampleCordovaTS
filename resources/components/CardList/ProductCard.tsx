import * as React from 'react';
import * as zod from "zod";
import {ProductValidator} from "../../models/product";
import {useAppSelector} from "../../redux/hooks";
import validators from "../../helpers/validators";
import {useTranslations} from "../../adapters/translatorAdapter";

import Svg from "../commons/Svg";

import * as PlaceholderImageSvg from "../../images/CardList/product_placeholder.svg";
import * as FavouriteSvg from "../../images/favourite.svg";
import * as CartSvg from "../../images/cart.svg";
import DefaultActions from "./ProductCard/DefaultActions";
import CartActions from "./ProductCard/CartActions";

import "../../styles/CardList/ProductCard.scss";

import * as pizza4seasons from "../../images/products/pizza/4seasons.png";
import * as pizzaDragon from "../../images/products/pizza/dragon.png";
import * as pizzaFamily from "../../images/products/pizza/family.png";
import * as pizzaMargarita from "../../images/products/pizza/margarita.png";
import * as pizzaVegetarian from "../../images/products/pizza/vegetarian.png";
import * as wokChicken from "../../images/products/wok/chicken.png";
import * as wokPork from "../../images/products/wok/pork.png";
import * as wokVeal from "../../images/products/wok/veal.png";
import * as wokVegetables from "../../images/products/wok/vegetables.png";

const images: { [key: string]: any } = {
    pizza4seasons,
    pizzaDragon,
    pizzaFamily,
    pizzaMargarita,
    pizzaVegetarian,
    wokChicken,
    wokPork,
    wokVeal,
    wokVegetables
};

function ProductCard(props: zod.infer<typeof ProductValidator>) {
    ProductValidator.parse(props);

    const tabName = useAppSelector((state) => state.tab.name);
    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate, pickTranslation] = useTranslations(localeCode);

    const renderProductImage = () => {
        const image = images[props.imageName].default;
        if (!validators.isPopulatedString(props.imageName) || !validators.isDefined(image)) {
            return <div className="product-image-container placeholder">
                <Svg src={PlaceholderImageSvg.default} className="icon-placeholder"/>
                {renderProductImageIcons()}
            </div>;
        }

        return (<div className="product-image-container">
            <img src={image}/>
            {renderProductImageIcons()}
        </div>);
    };

    const renderProductImageIcons = () => {
        let components = [];
        if (tabName !== "wishlist" && props.inWishlist === true) {
            components.push(<Svg key={0} src={FavouriteSvg.default} className="svg-danger icon-wishlist" width={20} height={20}/>);
        }
        if (tabName !== "cart" && props.inCart > 0) {
            components.push(<div className="icon-cart">
                <Svg key={1} src={CartSvg.default} className="svg-background" width={12} height={12}/>
                {props.inCart}
            </div>);
        }

        return components;
    };

    const renderProductInfo = () => {
        return (
            <div className="details">
                <div className="details-name">{pickTranslation(props.name)}</div>
                <div className="details-price">{props.price} {translate("UAH", "General")}</div>
                <div className="details-description">{pickTranslation(props.description)}</div>
            </div>
        );
    };

    const renderActions = () => {
        if (tabName === "cart") {
            return <CartActions ID={props.ID} inCart={props.inCart}/>
        }

        return <DefaultActions ID={props.ID} inWishlist={props.inWishlist} productPrice={props.price}/>;
    };

    return (
        <div className="card product-card">
            {renderProductImage()}
            {renderProductInfo()}
            {renderActions()}
        </div>
    );
}

export default ProductCard;