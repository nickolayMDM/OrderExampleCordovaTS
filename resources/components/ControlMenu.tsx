import * as React from 'react';
import * as CSS from 'csstype';
import {useAppSelector} from "../redux/hooks";
import validators from "../helpers/validators";

import "../styles/ControlMenu.scss";

import HomeButton from "./ControlMenu/HomeButton";
import SearchButton from "./ControlMenu/SearchButton";
import CartButton from "./ControlMenu/CartButton";
import WishlistButton from "./ControlMenu/WishlistButton";
import SettingsButton from "./ControlMenu/SettingsButton";
import SearchInput from "./ControlMenu/SearchInput";
import ConfirmOrder from "./ControlMenu/ConfirmOrder";

//TODO: add xstate
const tabsWithControlPopup: {[key: string]: number} = Object.freeze({
    search: null,
    cart: 69
});

function ControlMenu() {
    const tabName = useAppSelector((state) => state.tab.name);
    const sceneName = useAppSelector((state) => state.scene.name);

    let [isPopupShown, setIsPopupShown] = React.useState(false);
    let [customPopupSize, setCustomPopupSize] = React.useState(null);

    React.useEffect(() => {
        handleTabSwitch();
    }, [tabName]);

    React.useEffect(() => {
        handleSceneSwitch();
    }, [sceneName]);

    const handleTabSwitch = () => {
        if (validators.isWithinArray<string>(tabName, Object.keys(tabsWithControlPopup))) {
            showControlPopup(tabsWithControlPopup[tabName]);
            return;
        }

        hideControlPopup();
    };

    const handleSceneSwitch = () => {
        if (sceneName !== "productList") {
            hideControlPopup();
        }
    };

    const hideControlPopup = () => {
        setIsPopupShown(false);
        setCustomPopupSize(null);
    };

    const showControlPopup = (customPopupSize: number) => {
        setIsPopupShown(true);
        setCustomPopupSize(customPopupSize);
    };

    const getClassName = () => {
        let classNameString = "control-menu";
        if (isPopupShown) {
            classNameString += " control-menu-opened";
        }

        return classNameString;
    };

    const getStyle = () => {
        let result: CSS.Properties = {};
        if (!isPopupShown) {
            return result;
        }

        if (validators.isPositiveInteger(customPopupSize)) {
            result.paddingTop = customPopupSize + "px";
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