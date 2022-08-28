import * as React from 'react';
import * as CSS from 'csstype';
import {useAppSelector} from "../redux/hooks";
import validators from "../helpers/validators";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import "../styles/ControlMenu.scss";

import HomeButton from "./ControlMenu/HomeButton";
import SearchButton from "./ControlMenu/SearchButton";
import CartButton from "./ControlMenu/CartButton";
import WishlistButton from "./ControlMenu/WishlistButton";
import SettingsButton from "./ControlMenu/SettingsButton";
import SearchInput from "./ControlMenu/SearchInput";
import ConfirmOrder from "./ControlMenu/ConfirmOrder";

const tabsWithControlPopup: {[key: string]: number} = Object.freeze({
    search: null,
    cart: 69
});

const stateSwitchEvent = {
    SWITCH_TO_DEFAULT: {
        target: "default"
    },
    SWITCH_TO_SEARCH: {
        target: "search"
    },
    SWITCH_TO_CART: {
        target: "cart"
    }
};

const stateMachine = createMachine({
    id: 'controlMenu',
    initial: "default",
    context: {
        paddingTop: null as number
    },
    states: {
        default: {
            entry: ["setDefaultPadding"],
            on: stateSwitchEvent
        },
        search: {
            entry: ["setDefaultPadding"],
            on: stateSwitchEvent
        },
        cart: {
            entry: ["setCartPadding"],
            on: stateSwitchEvent
        }
    }
});

function ControlMenu() {
    const tabName = useAppSelector((state) => state.tab.name);
    const sceneName = useAppSelector((state) => state.scene.name);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            setDefaultPadding: (context) => {
                context.paddingTop = null;
            },
            setCartPadding: (context) => {
                context.paddingTop = 69;
            }
        }
    });

    React.useEffect(() => {
        sendTabToState(tabName);
    }, [tabName]);

    React.useEffect(() => {
        handleSceneSwitch();
    }, [sceneName]);

    const sendTabToState = (tab: string) => {
        switch (tab) {
            case "cart":
                sendToState("SWITCH_TO_CART");
                break;
            case "search":
                sendToState("SWITCH_TO_SEARCH");
                break;
            default:
                sendToState("SWITCH_TO_DEFAULT");
                break;
        }
    };

    const handleSceneSwitch = () => {
        if (sceneName !== "productList") {
            sendToState("SWITCH_TO_DEFAULT");
            return;
        }

        sendTabToState(tabName);
    };

    const getClassName = () => {
        let classNameString = "control-menu";
        if (currentState.value !== "default") {
            classNameString += " control-menu-opened";
        }

        return classNameString;
    };

    const getStyle = () => {
        let result: CSS.Properties = {};
        if (currentState.value === "default") {
            return result;
        }

        if (validators.isPositiveInteger(currentState.context.paddingTop)) {
            result.paddingTop = currentState.context.paddingTop + "px";
        }

        return result;
    };

    return (
        <div style={getStyle()} className={getClassName()}>
            <div className="control-menu-buttons-container">
                <HomeButton/>
                <SearchButton/>
                <CartButton/>
                <WishlistButton/>
                <SettingsButton/>
            </div>

            <SearchInput/>
            <ConfirmOrder/>
        </div>
    );
}

export default ControlMenu;