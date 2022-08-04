import * as React from 'react';
import * as zod from "zod";
import {stateInstantFadeMS} from "../../../config";
import {createMachine, assign} from 'xstate';
import {useMachine} from '@xstate/react';
import {useAppSelector, useAppDispatch} from "../../../redux/hooks";
import {revertNameToDefault as revertModalNameToDefault} from "../../../redux/slices/modalSlice";

import "../../../styles/commons/Modal/ModalBackground.scss";

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
    id: 'modalBackground',
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

function ModalBackground() {
    const dispatch = useAppDispatch();
    const [currentState, sendToState] = useMachine(stateMachine);

    //TODO: create exported selectors inside slices to reduce repetition
    let modalName = useAppSelector((state) => state.modal.name);

    React.useEffect(() => {
        if (modalName !== null) {
            fadeIn();
        } else if (modalName === null) {
            fadeOut();
        }
    }, [modalName]);

    const fadeOut = () => {
        sendToState("HIDE");
    };

    const fadeIn = () => {
        sendToState("SHOW");
    };

    const handleClick = () => {
        dispatch(revertModalNameToDefault());
    };

    const getClassName = () => {
        return "modal-background " + currentState.context.className;
    };

    return (
        <div className={getClassName()} onClick={handleClick}/>
    );
}

export default ModalBackground;