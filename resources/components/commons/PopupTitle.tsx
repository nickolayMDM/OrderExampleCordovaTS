import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";

import "../../styles/commons/PopupTitle.scss";

//TODO: add xstate
const fadeStates = {
    active: "active transition",
    fade: "fade transition",
    hidden: "hidden"
};

export const PopupTitlePropsValidator = zod.object({
    display: zod.boolean().optional(),
    className: zod.string().min(1).optional()
});

const fadeSpeedMS = 300;

function PopupTitle(props: React.PropsWithChildren<zod.infer<typeof PopupTitlePropsValidator>>) {
    PopupTitlePropsValidator.passthrough().parse(props);

    let [fadeState, setFadeState] = React.useState(fadeStates.hidden);
    let [displayed, setDisplayed] = React.useState(false);
    let [fadeTimeout, setFadeTimeout] = React.useState(null as ReturnType<typeof setTimeout>);

    React.useEffect(() => {
        if (props.display && !displayed && fadeState !== fadeStates.active) {
            fadeIn();
        } else if (!props.display && displayed && fadeState !== fadeStates.hidden) {
            fadeOut();
        }

        setDisplayed(props.display);
    });

    const clearFadeTimeout = () => {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
    };

    const fadeOut = () => {
        clearFadeTimeout();

        setFadeState(fadeStates.fade);

        setFadeTimeout(setTimeout(function() {
            setFadeState(fadeStates.hidden);
        }, fadeSpeedMS));
    };

    const fadeIn = () => {
        clearFadeTimeout();

        setFadeState(fadeStates.fade);

        setFadeTimeout(setTimeout(() => {
            setFadeState(fadeStates.active);
        }, 0));
    };

    const getClassName = () => {
        let classNameString = "popup-title " + fadeState;
        if (validators.isPopulatedString(props.className)) {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    return (
        <div className={getClassName()}>
            {props.children}
        </div>
    );
}

export default PopupTitle;