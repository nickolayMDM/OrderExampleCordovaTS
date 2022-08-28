import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {assign, createMachine} from "xstate";
import {stateInstantFadeMS} from "../../config";
import {useMachine} from "@xstate/react";

import "../../styles/commons/PopupTitle.scss";

const fadeSpeedMS = 300;

const stateEnum = zod.enum([
    "hidden",
    "fadingIn",
    "fadingOut",
    "active",
]);

const stateClassNameEnum = zod.nativeEnum({
    [stateEnum.enum.hidden]: "hidden",
    [stateEnum.enum.fadingIn]: "fade transition",
    [stateEnum.enum.fadingOut]: "fade transition",
    [stateEnum.enum.active]: "active transition",
});

const stateMachine = createMachine({
    id: 'popupTitle',
    initial: stateEnum.enum.hidden,
    context: {
        className: stateClassNameEnum.enum[stateEnum.enum.hidden]
    },
    states: {
        [stateEnum.enum.hidden]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateClassNameEnum.enum[stateEnum.enum.hidden]
            })),
            on: {
                SHOW: {
                    target: stateEnum.enum.fadingIn
                }
            }
        },
        [stateEnum.enum.fadingIn]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateClassNameEnum.enum[stateEnum.enum.fadingIn]
            })),
            after: {
                [stateInstantFadeMS]: {
                    target: stateEnum.enum.active
                }
            },
            on: {
                HIDE: {
                    target: stateEnum.enum.fadingOut
                }
            }
        },
        [stateEnum.enum.fadingOut]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateClassNameEnum.enum[stateEnum.enum.fadingOut]
            })),
            after: {
                [fadeSpeedMS]: {
                    target: stateEnum.enum.hidden
                }
            },
            on: {
                SHOW: {
                    target: stateEnum.enum.fadingIn
                }
            }
        },
        [stateEnum.enum.active]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateClassNameEnum.enum[stateEnum.enum.active]
            })),
            on: {
                HIDE: {
                    target: stateEnum.enum.fadingOut
                }
            }
        }
    }
});

export const PopupTitlePropsValidator = zod.object({
    display: zod.boolean().optional(),
    className: zod.string().min(1).optional()
});

function PopupTitle(props: React.PropsWithChildren<zod.infer<typeof PopupTitlePropsValidator>>) {
    PopupTitlePropsValidator.passthrough().parse(props);

    const [currentState, sendToState] = useMachine(stateMachine);

    React.useEffect(() => {
        if (props.display) {
            fadeIn();
        } else if (!props.display) {
            fadeOut();
        }
    }, [props.display]);

    const fadeOut = () => {
        sendToState("HIDE");
    };

    const fadeIn = () => {
        sendToState("SHOW");
    };

    const getClassName = () => {
        let classNameString = "popup-title " + currentState.context.className;
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