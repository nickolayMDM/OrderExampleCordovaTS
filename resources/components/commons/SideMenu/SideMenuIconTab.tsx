import * as React from 'react';
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {setOpenName} from "../../../redux/slices/sideMenuSlice";
import * as zod from "zod";

import Svg from "../Svg";

import * as CategoriesSvg from "../../../images/categories.svg";

export const SideMenuIconTabPropsValidator = zod.object({
    name: zod.string().min(1)
});

function SideMenuIconTab(props: React.PropsWithChildren<zod.infer<typeof SideMenuIconTabPropsValidator>>) {
    SideMenuIconTabPropsValidator.parse(props);

    let globalSideMenuData = useAppSelector((state) => state.sideMenu);
    const dispatch = useAppDispatch();

    const handleClick = () => {
        if (globalSideMenuData.openMenuName === props.name) {
            dispatch(setOpenName(""));
        }
    };

    return (
        <div className="side-menu-icon-tab" onClick={handleClick}>
            <Svg src={CategoriesSvg.default} width={25} height={25}/>
        </div>
    );
}

export default SideMenuIconTab;