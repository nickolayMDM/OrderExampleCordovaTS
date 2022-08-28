import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setCategoryID as setProductFilterCategoryID} from "../../redux/slices/productsSlice";
import {setOpenName as setOpenSideMenuName} from "../../redux/slices/sideMenuSlice";
import {type Category} from "../../../serverMock/categories";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import "../../styles/sideMenus/Categories.scss";

import SideMenu from "../commons/SideMenu";
import Button from "../commons/Button";
import SideMenuIconTab from "../commons/SideMenu/SideMenuIconTab";
import SideMenuHeader from "../commons/SideMenu/SideMenuHeader";

export const CategoriesSideMenuPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

const stateMachine = createMachine({
    id: 'categoriesSideMenu',
    initial: "initiating",
    context: {
        list: [] as Category[]
    },
    states: {
        initiating: {
            entry: ["initiate"],
            on: {
                INITIATED: {
                    target: "default"
                }
            }
        },
        default: {
            type: "final"
        }
    }
});

const menuName = "categories";

function CategoriesSideMenu(props: zod.infer<typeof CategoriesSideMenuPropsValidator>) {
    CategoriesSideMenuPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    let productFilterCategoryID = useAppSelector((state) => state.products.filter.categoryID);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate, pickTranslation] = useTranslations(languageCode);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            initiate: (context) => {
                const categories = serverRequester.getCategories();
                context.list = categories;

                sendToState("INITIATED");
            }
        }
    });

    const getButtonClassName = (ID: number) => {
        let result = "button-link";

        const currentCategoryID = productFilterCategoryID;
        if (currentCategoryID === ID) {
            result += " active";
        }

        return result;
    };

    const renderList = () => {
        if (!validators.isPopulatedArray(currentState.context.list)) {
            return "";
        }

        let components = [];
        for (let key in currentState.context.list) {
            if (!currentState.context.list.hasOwnProperty(key)) continue;

            components.push(<Button key={currentState.context.list[key].ID} className={getButtonClassName(currentState.context.list[key].ID)}
                                    onClick={setProductListCategory.bind(null, currentState.context.list[key].ID)}>
                {pickTranslation(currentState.context.list[key].name)}
            </Button>);
        }

        return components;
    };

    const setProductListCategory = (value: number) => {
        dispatch(setProductFilterCategoryID(value));
        dispatch(setOpenSideMenuName(""));
    };

    return (
        <SideMenu name={menuName} className={props.className}>
            <SideMenuIconTab name={menuName}/>
            <SideMenuHeader text={translate("Categories", "General")}/>
            <div className="categories-list">
                <Button className={getButtonClassName(null)}
                        onClick={setProductListCategory.bind(null, null)}>
                    {translate("All", "General")}
                </Button>
                {renderList()}
            </div>
        </SideMenu>
    );
}

export default CategoriesSideMenu;