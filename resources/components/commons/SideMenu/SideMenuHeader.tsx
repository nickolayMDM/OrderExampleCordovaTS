import * as React from 'react';
import * as zod from "zod";

export const SideMenuHeaderPropsValidator = zod.object({
    text: zod.string().min(1)
});

function SideMenuHeader(props: zod.infer<typeof SideMenuHeaderPropsValidator>) {
    SideMenuHeaderPropsValidator.parse(props);

    return (
        <h1 className="side-menu-header">
            {props.text}
        </h1>
    );
}

export default SideMenuHeader;