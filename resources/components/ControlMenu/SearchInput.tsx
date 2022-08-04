import * as React from 'react';
import * as zod from "zod";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setSearchQuery as setGlobalSearchQuery} from "../../redux/slices/productsSlice";

import TextInput from "../commons/Input/TextInput";

import "../../styles/ControlMenu/SearchInput.scss";

export const SearchInputPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

const performSearchDelayMS = 500;

//TODO: add xstate
function SearchInput(props: zod.infer<typeof SearchInputPropsValidator>) {
    SearchInputPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    let [performSearchTimeoutID, setPerformSearchTimeoutID] = React.useState(null as ReturnType<typeof setTimeout>);
    let [displayed, setDisplayed] = React.useState(false);
    let [active, setActive] = React.useState(false);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let tabName = useAppSelector((state) => state.tab.name);
    let globalSearchQuery = useAppSelector((state) => state.products.filter.searchQuery);
    let [localSearchQuery, setLocalSearchQuery] = React.useState(globalSearchQuery);
    let [translate] = useTranslations(languageCode);

    const clearInput = () => {
        setLocalSearchQuery("");
    };

    const handleTabChange = () => {
        if (tabName === "search") {
            setDisplayed(true);
            clearInput();
        } else {
            if (displayed === true) {
                setDisplayed(false);
            }
        }
    };

    const handleSearchChange = () => {
        if (active) {
            clearTimeout(performSearchTimeoutID);
            setPerformSearchTimeoutID(setTimeout(performSearch, performSearchDelayMS));
        } else {
            dispatch(setGlobalSearchQuery(""));
        }
    };

    const performSearch = () => {
        dispatch(setGlobalSearchQuery(localSearchQuery));
    };

    React.useEffect(() => {
        handleTabChange();
    }, [tabName]);

    React.useEffect(() => {
        handleSearchChange();
    }, [localSearchQuery]);

    const getClassName = () => {
        let classNameString = "control-menu-popup search-input";
        if (!displayed) {
            classNameString += " hidden";
        }
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!active) {
            return;
        }

        setLocalSearchQuery(event.target.value);
    };

    const activateSearchInput = () => {
        setActive(true);
    };

    const disableSearchInput = () => {
        setActive(false);
    };

    return (
        <div className={getClassName()}>
            <TextInput onChange={handleSearchTextChange}
                       onFocus={activateSearchInput}
                       onBlur={disableSearchInput}
                       value={localSearchQuery}
                       placeholder={translate("Your query here...", "Form")}
                       name="searchInput"
                       autoComplete="off"/>
        </div>
    );
}

export default SearchInput;