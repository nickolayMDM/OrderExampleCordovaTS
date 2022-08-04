import * as React from 'react';
import * as zod from "zod";
import {areObjectsSimilar} from "../../helpers/objects";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {setActiveLeftMenuName} from "../../redux/slices/sideMenuSlice";
import {addAvailableName as addAvailableTabName, setName as setTabName} from "../../redux/slices/tabSlice";
import {ScenePropsValidator} from "./SceneInterface";

import Scene from "../commons/Scene";
import ProductCard from "../CardList/ProductCard";
import LoadingBlock from "../commons/LoadingBlock";

const sceneName = "productList";

const tabNames = [
    "menu",
    "wishlist",
    "cart",
    "search"
];

//TODO: add xstate
function ProductListScene(props: zod.infer<typeof ScenePropsValidator>) {
    ScenePropsValidator.parse(props);

    const dispatch = useAppDispatch();
    const globalTabName = useAppSelector((state) => state.tab.name);
    const globalProductFilter = useAppSelector((state) => state.products.filter);
    const globalProductList = useAppSelector((state) => state.products.list);
    const globalLocaleCode = useAppSelector((state) => state.language.localeCode);
    const inWishlistTotal = useAppSelector((state) => state.wishlist.inWishlistTotal);
    const inCartTotal = useAppSelector((state) => state.cart.inCartTotal);

    let [localTabName, setLocalTabName] = React.useState(globalTabName);
    let [isLoading, setIsLoading] = React.useState(false);
    let [productList, setProductList] = React.useState([] as Product[]);

    const handleProductListChange = async () => {
        setProductList(globalProductList);
    };

    React.useEffect(() => {
        for (let key = 0; key < tabNames.length; key++) {
            dispatch(addAvailableTabName(tabNames[key]));
        }

        getContents();
    }, []);

    React.useEffect(() => {
        if (inWishlistTotal <= 0 && globalTabName === "wishlist") {
            dispatch(setTabName("menu"));
        }
    }, [inWishlistTotal]);

    React.useEffect(() => {
        if (inCartTotal <= 0 && globalTabName === "cart") {
            dispatch(setTabName("menu"));
        }

        getContents();
    }, [inCartTotal]);

    React.useEffect(() => {
        if (!areObjectsSimilar(globalProductList, productList)) {
            handleProductListChange();
        }
    }, [globalProductList]);

    const handleTabChange = () => {
        setLocalTabName(globalTabName);
        toggleCategoriesSideMenu();
    };

    React.useEffect(() => {
        if (localTabName !== globalTabName) {
            handleTabChange();
            getContents();
        }
    }, [globalTabName]);

    React.useEffect(() => {
        getContents();
    }, [globalProductFilter]);

    const getContents = async () => {
        setIsLoading(true);

        const productList = await serverRequester.getProductsPage(
            globalProductFilter,
            globalLocaleCode,
            globalTabName
        );

        setProductList(productList);
        setIsLoading(false);
    };

    const toggleCategoriesSideMenu = () => {
        // if (localTabName === "menu") {
        //     dispatch(setActiveLeftMenuName("categories"));
        // } else {
        //     dispatch(setActiveLeftMenuName(""));
        // }
    };

    const renderProducts = () => {
        if (productList.length < 1) {
            return [];
        }

        return productList.map((item: Product) => {
            return <ProductCard
                key={item.ID}
                ID={item.ID}
                categoryID={item.categoryID}
                imageName={item.imageName}
                inWishlist={item.inWishlist}
                inCart={item.inCart}
                name={item.name}
                price={item.price}
                description={item.description}
            />;
        });
    };

    return (
        <Scene name={sceneName} activate={props.activate} className="card-list">
            <LoadingBlock isLoading={isLoading}/>
            {renderProducts()}
        </Scene>
    );
}

export default ProductListScene;