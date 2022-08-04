import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setSceneName} from "../../redux/slices/sceneSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import {setCategoryID as setProductFilterCategoryID} from "../../redux/slices/productsSlice";

import Svg from "../commons/Svg";

import * as searchImage from "../../images/search.svg";

function SearchButton() {
    const dispatch = useAppDispatch();

    let languageCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(languageCode);

    const showSearchBar = () => {
        dispatch(setSceneName("productList"));
        dispatch(setProductFilterCategoryID(null));
        dispatch(setTabName("search"));
    };

    return (
        <div className="search-button" onClick={showSearchBar}>
            <Svg src={searchImage.default} width={23} height={23}/>
            <p className="description-text">{translate("Search", "Actions")}</p>
        </div>
    );
}

export default SearchButton;