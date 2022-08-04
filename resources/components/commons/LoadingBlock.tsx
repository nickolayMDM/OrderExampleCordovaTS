import * as React from 'react';
import * as zod from "zod";
import {assign, createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import LoadingIcon from "./LoadingIcon";

const stateEnum = zod.enum([
    "hidden",
    "fadingIn",
    "active",
]);

const stateClassNameEnum = zod.nativeEnum({
    [stateEnum.enum.hidden]: "hidden",
    [stateEnum.enum.fadingIn]: "fade-in",
    [stateEnum.enum.active]: "",
});

const stateMachine = createMachine({
    id: 'loadingBlock',
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
                1: {
                    target: stateEnum.enum.active
                }
            },
            on: {
                HIDE: {
                    target: stateEnum.enum.hidden
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
                    target: stateEnum.enum.hidden
                }
            }
        }
    }
});

export const LoadingBlockPropsValidator = zod.object({
    isLoading: zod.boolean()
});

const loadingTimeoutTimeMS = 250;

function LoadingBlock(props: zod.infer<typeof LoadingBlockPropsValidator>) {
    LoadingBlockPropsValidator.parse(props);

    const [currentState, sendToState] = useMachine(stateMachine);

    React.useEffect(() => {
        if (props.isLoading) {
            show();
        } else if (!props.isLoading) {
            hide();
        }
    }, [props.isLoading]);

    const show = () => {
        sendToState("SHOW");
    };

    const hide = () => {
        sendToState("HIDE");
    };

    const getClassName = () => {
        return "loading-overlay " + currentState.context.className;
    };

    return (
        <div className={getClassName()}>
            <LoadingIcon size="2x"/>
        </div>
    );
}

export default LoadingBlock;