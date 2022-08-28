import * as React from 'react';
import * as zod from "zod";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setSearchQuery as setGlobalSearchQuery} from "../../redux/slices/productsSlice";

import TextInput from "../commons/Input/TextInput";

import "../../styles/ControlMenu/SearchInput.scss";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";
import {addAvailableName} from "../../redux/slices/modalSlice";
import {BaseInputElement} from "../commons/Input/BaseInput";

export const SearchInputPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

const performSearchDelayMS = 500;

const stateMachine = createMachine({
    id: 'searchInput',
    initial: "hidden",
    states: {
        hidden: {
            entry: ["clearValue"],
            on: {
                SHOW: {
                    target: "disabled"
                },
                SHOW_AND_ACTIVATE: {
                    target: "idle"
                }
            }
        },
        disabled: {
            on: {
                ACTIVATE: {
                    target: "idle"
                },
                HIDE: {
                    target: "hidden"
                }
            }
        },
        idle: {
            on: {
                HIDE: {
                    target: "hidden"
                },
                DISABLE: {
                    target: "disabled"
                },
                VALUE_CHANGE: {
                    target: "preSearch"
                }
            }
        },
        preSearch: {
            after: {
                [performSearchDelayMS]: {
                    target: "idle",
                    actions: ["performSearch"]
                }
            },
            on: {
                VALUE_CHANGE: {
                    target: "preSearch"
                },
                HIDE: {
                    target: "hidden"
                },
                CANCEL_SEARCH: {
                    target: "idle"
                }
            }
        }
    }
});

function SearchInput(props: zod.infer<typeof SearchInputPropsValidator>) {
    SearchInputPropsValidator.parse(props);

    const dispatch = useAppDispatch();
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let tabName = useAppSelector((state) => state.tab.name);
    let inputRef = React.useRef<BaseInputElement>();
    let [translate] = useTranslations(languageCode);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            clearValue: () => {
                inputRef.current.setValue("");
            },
            performSearch: () => {
                dispatch(setGlobalSearchQuery(inputRef.current.getValue()));
            }
        }
    });

    const handleTabChange = () => {
        if (tabName === "search") {
            sendToState("SHOW");
        } else {
            sendToState("HIDE");
        }
    };

    React.useEffect(() => {
        handleTabChange();
    }, [tabName]);

    const getClassName = () => {
        let classNameString = "control-menu-popup search-input";
        if (currentState.value === "hidden") {
            classNameString += " hidden";
        }
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const handleSearchTextChange = () => {
        sendToState("VALUE_CHANGE");
    };

    const activateSearchInput = () => {
        sendToState("ACTIVATE");
    };

    const disableSearchInput = () => {
        sendToState("DISABLE");
    };

    return (
        <div className={getClassName()}>
            <TextInput ref={inputRef}
                       onChange={handleSearchTextChange}
                       onFocus={activateSearchInput}
                       onBlur={disableSearchInput}
                       placeholder={translate("Your query here...", "Form")}
                       name="searchInput"
                       autoComplete="off"/>
        </div>
    );
}

export default SearchInput;