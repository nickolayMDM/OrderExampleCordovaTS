import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {setName as setSceneName, addAvailableName as addAvailableSceneName} from "../../redux/slices/sceneSlice";
import {assign, createMachine, actions} from "xstate";
import {stateInstantFadeMS} from "../../config";
import {useMachine} from "@xstate/react";

import "../../styles/commons/Scene.scss";

export const ScenePropsValidator = zod.object({
    name: zod.string().min(1),
    className: zod.string().min(1).optional(),
    activate: zod.boolean().optional()
});

const stateEnum = zod.enum([
    "hidden",
    "active",
]);

const stateMachine = createMachine({
    id: 'scene',
    initial: "initiating",
    context: {
        className: stateEnum.enum.hidden
    },
    states: {
        initiating: {
            entry: ["initialize"],
            after: {
                [stateInstantFadeMS]: {
                    target: stateEnum.enum.hidden
                }
            },
            on: {
                SHOW: {
                    target: stateEnum.enum.active
                }
            }
        },
        [stateEnum.enum.hidden]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateEnum.enum.hidden
            })),
            on: {
                SHOW: {
                    target: stateEnum.enum.active
                }
            }
        },
        [stateEnum.enum.active]: {
            entry: assign((context) => ({
                ...context as object,
                className: stateEnum.enum.active
            })),
            on: {
                HIDE: {
                    target: stateEnum.enum.hidden
                }
            }
        }
    }
});

function Scene(props: React.PropsWithChildren<zod.infer<typeof ScenePropsValidator>>) {
    ScenePropsValidator.passthrough().parse(props);

    const dispatch = useAppDispatch();
    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            initialize: () => {
                dispatch(addAvailableSceneName(props.name));
                if (props.activate) {
                    dispatch(setSceneName(props.name));
                    actions.send("SHOW");
                }
            }
        }
    });

    let globalSceneName = useAppSelector((state) => state.scene.name);

    const hideScene = () => {
        sendToState("HIDE");
    };

    const showScene = () => {
        sendToState("SHOW");
    };

    const switchScene = () => {
        if (globalSceneName === props.name) {
            showScene();
            return;
        }

        hideScene();
    };

    React.useEffect(() => {
        switchScene();
    }, [globalSceneName, props.name]);

    const getClassName = () => {
        let classNameString = "scene scene-" + props.name + " " + currentState.context.className;
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

export default Scene;