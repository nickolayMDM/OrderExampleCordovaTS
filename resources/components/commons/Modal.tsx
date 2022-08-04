import * as React from 'react';
import * as zod from "zod";
import {stateInstantFadeMS} from "../../config";
import {assign, createMachine} from "xstate";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {addAvailableName} from "../../redux/slices/modalSlice";

import "../../styles/commons/Modal.scss";
import {useMachine} from "@xstate/react";

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

const fadeSpeedMS = 300;

const stateMachine = createMachine({
    id: 'modal',
    initial: "initiating",
    context: {
        className: stateClassNameEnum.enum[stateEnum.enum.hidden]
    },
    states: {
        initiating: {
            entry: ["initialize"],
            after: {
                [stateInstantFadeMS]: {
                    target: stateEnum.enum.hidden
                }
            },
        },
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

export const ModalPropsValidator = zod.object({
    name: zod.string().min(1),
    className: zod.string().min(1).optional(),
    onOpen: zod.function().returns(zod.void()).optional()
});

function Modal(props: React.PropsWithChildren<zod.infer<typeof ModalPropsValidator>>) {
    ModalPropsValidator.passthrough().parse(props);

    const dispatch = useAppDispatch();
    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            initialize: () => {
                dispatch(addAvailableName(props.name));
            }
        }
    });

    let modalName = useAppSelector((state) => state.modal.name);

    React.useEffect(() => {
        if (modalName === props.name) {
            fadeIn();
        } else if (modalName !== props.name) {
            fadeOut();
        }
    }, [modalName]);

    const fadeOut = () => {
        sendToState("HIDE");
    };

    const fadeIn = () => {
        sendToState("SHOW");
    };

    const getClassName = () => {
        let classNameString = "modal modal-" + props.name + " " + currentState.context.className;
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

export default Modal;