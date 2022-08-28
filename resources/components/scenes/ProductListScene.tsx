import * as React from 'react';
import * as zod from "zod";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {addAvailableName as addAvailableTabName, setName as setTabName} from "../../redux/slices/tabSlice";
import {setActiveLeftMenuName} from "../../redux/slices/sideMenuSlice";
import {ScenePropsValidator} from "./SceneInterface";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import Scene from "../commons/Scene";
import ProductCard from "../CardList/ProductCard";
import LoadingBlock from "../commons/LoadingBlock";

const sceneName = "productList";

//TODO: make a tab common component, use that to add tab names instead of the scene; maybe make scenes for every tab
const tabNames = [
    "menu",
    "wishlist",
    "cart",
    "search"
];

const stateMachine = createMachine({
    id: 'productListScene',
    initial: "initiating",
    context: {
        tab: "",
        productList: [] as Product[]
    },
    states: {
        initiating: {
            entry: ["initialize"],
            on: {
                INITIATED: {
                    target: "loading"
                }
            }
        },
        loading: {
            entry: ["getContents"],
            on: {
                LOADED: {
                    target: "active"
                }
            }
        },
        active: {
            on: {
                LOAD: {
                    target: "loading"
                }
            }
        }
    }
});

function ProductListScene(props: zod.infer<typeof ScenePropsValidator>) {
    ScenePropsValidator.parse(props);

    const dispatch = useAppDispatch();
    const globalSceneName = useAppSelector((state) => state.scene.name);
    const globalTabName = useAppSelector((state) => state.tab.name);
    const globalProductFilter = useAppSelector((state) => state.products.filter);
    const globalLocaleCode = useAppSelector((state) => state.language.localeCode);
    const inWishlistTotal = useAppSelector((state) => state.wishlist.inWishlistTotal);
    const inCartTotal = useAppSelector((state) => state.cart.inCartTotal);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            initialize: () => {
                for (let key = 0; key < tabNames.length; key++) {
                    dispatch(addAvailableTabName(tabNames[key]));
                }
                dispatch(setTabName("menu"));

                sendToState("INITIATED");
            },
            getContents: async (context) => {
                const productList = await serverRequester.getProductsPage(
                    globalProductFilter,
                    globalLocaleCode,
                    globalTabName
                );

                context.productList = productList;
                sendToState("LOADED");
            }
        }
    });

    React.useEffect(() => {
        if (inWishlistTotal <= 0 && globalTabName === "wishlist") {
            dispatch(setTabName("menu"));
        }

        sendToState("LOAD");
    }, [inWishlistTotal]);

    React.useEffect(() => {
        if (inCartTotal <= 0 && globalTabName === "cart") {
            dispatch(setTabName("menu"));
        }

        sendToState("LOAD");
    }, [inCartTotal]);

    React.useEffect(() => {
        if (currentState.context.tab !== globalTabName) {
            sendToState("LOAD");
            toggleCategoriesSideMenu();
        }
    }, [globalTabName]);

    React.useEffect(() => {
        toggleCategoriesSideMenu();
    }, [globalSceneName]);

    React.useEffect(() => {
        sendToState("LOAD");
    }, [globalProductFilter]);

    const toggleCategoriesSideMenu = () => {
        if (globalTabName === "menu" && globalSceneName === sceneName) {
            dispatch(setActiveLeftMenuName("categories"));
        } else {
            dispatch(setActiveLeftMenuName(""));
        }
    };

    const renderProducts = () => {
        if (currentState.context.productList.length < 1) {
            return [];
        }

        return currentState.context.productList.map((item: Product) => {
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

    const isLoading = () => {
        return currentState.value === "loading";
    };

    return (
        <Scene name={sceneName} activate={props.activate} className="card-list">
            <LoadingBlock isLoading={isLoading()}/>
            {renderProducts()}
        </Scene>
    );
}

export default ProductListScene;