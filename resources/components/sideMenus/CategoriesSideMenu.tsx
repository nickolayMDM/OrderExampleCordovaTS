import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import serverRequester from "../../adapters/serverRequesterAdapter";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setCategoryID as setProductFilterCategoryID} from "../../redux/slices/productsSlice";
import {setActiveLeftMenuName} from "../../redux/slices/sideMenuSlice";

import "../../styles/sideMenus/Categories.scss";

import SideMenu from "../commons/SideMenu";
import Button from "../commons/Button";
import SideMenuIconTab from "../commons/SideMenu/SideMenuIconTab";
import SideMenuHeader from "../commons/SideMenu/SideMenuHeader";

export const CategoriesSideMenuPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

const menuName = "categories";

function CategoriesSideMenu(props: zod.infer<typeof CategoriesSideMenuPropsValidator>) {
    CategoriesSideMenuPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    let productFilterCategoryID = useAppSelector((state) => state.products.filter.categoryID);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate, pickTranslation] = useTranslations(languageCode);
    let [list, setList] = React.useState([]);

    (() => {
        const categories = serverRequester.getCategories();

        setList(categories);
    })();

    const getButtonClassName = (ID: number) => {
        let result = "button-link";

        const currentCategoryID = productFilterCategoryID;
        if (currentCategoryID === ID) {
            result += " active";
        }

        return result;
    };

    const renderList = () => {
        if (!validators.isPopulatedArray(list)) {
            return "";
        }

        let components = [];
        for (let key in list) {
            if (!list.hasOwnProperty(key)) continue;

            components.push(<Button key={list[key].ID} className={getButtonClassName(list[key].ID)}
                                    onClick={setProductListCategory.bind(null, list[key].ID)}>
                {pickTranslation(list[key].name)}
            </Button>);
        }

        return components;
    };

    const setProductListCategory = (value: number) => {
        dispatch(setProductFilterCategoryID(value));
        dispatch(setActiveLeftMenuName(""));
    };

    return (
        <SideMenu name={menuName} className={props.className}>
            <SideMenuIconTab/>
            <SideMenuHeader text={translate("Categories", "General")}/>
            <div className="categories-list">
                <Button className={getButtonClassName(null)}
                        onClick={setProductListCategory.bind(null, 0)}>
                    {translate("All", "General")}
                </Button>
                {renderList()}
            </div>
        </SideMenu>
    );
}

export default CategoriesSideMenu;