import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setSceneName} from "../../redux/slices/sceneSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import {revertFilterToDefault as revertProductFilterToDefault} from "../../redux/slices/productsSlice";

import Svg from "../commons/Svg";

import * as homeImage from "../../images/menu.svg";

function HomeButton() {
    const dispatch = useAppDispatch();

    let languageCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(languageCode);

    const gotoHome = () => {
        dispatch(setSceneName("productList"));
        dispatch(revertProductFilterToDefault());
        dispatch(setTabName("menu"));
    };

    return (
        <div className="home-button" onClick={gotoHome}>
            <Svg src={homeImage.default} width={30} height={30}/>
            <p className="description-text">{translate("To Menu", "Actions")}</p>
        </div>
    );
}

export default HomeButton;