import * as React from 'react';
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

import "../../styles/commons/Loading.scss";

export interface LoadingIconProps extends Omit<FontAwesomeIconProps, "icon"> {}

function LoadingIcon(props: LoadingIconProps) {
    const getClassName = () => {
        let classNameArray = ["icon loading"];
        if (typeof props.className === "string") {
            classNameArray.push(props.className);
        }
        const classNameString = classNameArray.join(" ");

        return classNameString;
    };

    return (
        <FontAwesomeIcon className={getClassName()} icon={faSpinner} size={props.size} />
    );
}

export default LoadingIcon;