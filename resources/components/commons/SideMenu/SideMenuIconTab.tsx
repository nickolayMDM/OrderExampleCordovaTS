import * as React from 'react';

import Svg from "../Svg";

import * as CategoriesSvg from "../../../images/categories.svg";

function SideMenuIconTab() {
    return (
        <div className="side-menu-icon-tab">
            <Svg src={CategoriesSvg} width={25} height={25}/>
        </div>
    );
}

export default SideMenuIconTab;