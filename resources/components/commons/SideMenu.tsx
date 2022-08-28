import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {addAvailableName, setOpenName} from "../../redux/slices/sideMenuSlice";
import {createMachine, StateValue} from "xstate";
import {useMachine} from "@xstate/react";

import "../../styles/commons/SideMenu.scss";

const minStateChangeOffsetPercent = 9;

export const SideMenuPropsValidator = zod.object({
    name: zod.string().min(1),
    className: zod.string().min(1).optional(),
    rightSide: zod.boolean().optional()
});

const stateMachine = createMachine({
    id: 'sideMenu',
    initial: "initiating",
    context: {
        toPreviousStateEventName: "",
        isRightSide: false,
        isMovingLeft: false,
        componentStartX: 0,
        touchStartX: 0,
        offsetX: 0
    },
    states: {
        initiating: {
            entry: ["initiate"],
            on: {
                INITIATED: {
                    target: "hidden"
                }
            }
        },
        hidden: {
            on: {
                DISPLAY: {
                    target: "closed"
                }
            }
        },
        closed: {
            on: {
                HIDE: {
                    target: "hidden"
                },
                MOVE: {
                    target: "moving"
                },
                OPEN: {
                    target: "open"
                },
                TOUCH_START: {
                    actions: ["setMoveContext"]
                },
                TOUCH_MOVE: {
                    actions: ["handleMove"]
                }
            }
        },
        moving: {
            on: {
                OPEN: {
                    target: "open"
                },
                CLOSE: {
                    target: "closed"
                },
                HIDE: {
                    target: "hidden"
                },
                TOUCH_MOVE: {
                    actions: ["handleMove"]
                },
                TOUCH_END: {
                    actions: ["endMove"]
                }
            }
        },
        open: {
            on: {
                MOVE: {
                    target: "moving"
                },
                CLOSE: {
                    target: "closed"
                },
                HIDE: {
                    target: "hidden"
                },
                TOUCH_START: {
                    actions: ["setMoveContext"]
                },
                TOUCH_MOVE: {
                    actions: ["handleMove"]
                }
            }
        }
    }
});

function SideMenu(props: React.PropsWithChildren<zod.infer<typeof SideMenuPropsValidator>>) {
    SideMenuPropsValidator.passthrough().parse(props);

    const dispatch = useAppDispatch();

    let ref = React.createRef<HTMLDivElement>();
    let globalSideMenuData = useAppSelector((state) => state.sideMenu);

    const isRightSideMenu = () => {
        return (props.rightSide);
    };

    const getCurrentStateEventName = () => {
        switch (currentState.value) {
            case "open":
                return "OPEN";
            case "closed":
                return "CLOSE";
            default:
                return "";
        }
    };

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            initiate: (context) => {
                dispatch(addAvailableName(props.name));
                context.isRightSide = isRightSideMenu();

                sendToState("INITIATED");
            },
            setMoveContext: (context, event) => {
                const componentLeftPx = ref.current.getBoundingClientRect().left;
                const componentLeftPercent = 100 / window.innerWidth * componentLeftPx;

                context.componentStartX = componentLeftPercent;
                context.touchStartX = event.payload.touches[0].clientX;
            },
            handleMove: (context, event) => {
                const offsetX = 100 / window.innerWidth * (event.payload.touches[0].clientX - context.touchStartX);
                context.offsetX = offsetX;
                let isMovingLeft = false;
                if (currentState.value !== "moving" && Math.abs(offsetX) > 1) {
                    context.toPreviousStateEventName = getCurrentStateEventName();
                    sendToState("MOVE");
                }
                if (offsetX < 0) {
                    isMovingLeft = true;
                }

                context.isMovingLeft = isMovingLeft;
            },
            endMove: (context) => {
                if (currentState.value === "moving") {
                    if (Math.abs(context.offsetX) > minStateChangeOffsetPercent) {
                        if (
                            (isRightSideMenu() && context.isMovingLeft)
                            || (!isRightSideMenu() && !context.isMovingLeft)
                        ) {
                            dispatch(setOpenName(props.name));
                        } else {
                            dispatch(setOpenName(""));
                        }
                    } else {
                        sendToState(context.toPreviousStateEventName);
                    }
                }
            }
        }
    });

    React.useEffect(() => {
        dispatch(addAvailableName(props.name));
    }, []);

    const isMenuDisplayed = () => {
        if (props.rightSide) {
            return globalSideMenuData.activeRightMenuName === props.name;
        }

        return globalSideMenuData.activeLeftMenuName === props.name;
    };

    const getGlobalDisplayVariableArray = () => {
        if (props.rightSide) {
            return [globalSideMenuData.activeRightMenuName];
        }

        return [globalSideMenuData.activeLeftMenuName];
    };

    React.useEffect(() => {
        if (globalSideMenuData.openMenuName === props.name) {
            sendToState("OPEN");
        } else if (globalSideMenuData.openMenuName !== props.name) {
            sendToState("CLOSE");
        }
    }, [globalSideMenuData.openMenuName]);

    React.useEffect(() => {
        let isMenuDisplayedBool = isMenuDisplayed();

        if (isMenuDisplayedBool) {
            sendToState("DISPLAY");
        } else {
            sendToState("HIDE");
        }
    }, getGlobalDisplayVariableArray());

    const getClassName = () => {
        let classNameString = "side-menu side-menu-" + props.name;
        if (isRightSideMenu()) {
            classNameString += " side-menu-right"
        } else {
            classNameString += " side-menu-left";
        }

        if (currentState.value !== "moving") {
            classNameString += " transitioning";
        }

        if (currentState.value === "open") {
            classNameString += " opened";
        } else if (currentState.value === "closed" || currentState.value === "moving") {
            classNameString += " showed";
        }

        if (validators.isPopulatedString(props.className)) {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const getStyle = () => {
        if (currentState.value !== "moving") {
            return {};
        }

        let left = currentState.context.componentStartX + currentState.context.offsetX;

        if (isRightSideMenu()) {
            return {left: Math.max(20, Math.min(left, 103)) + "%"};
        }

        return {left: Math.max(-83, Math.min(left, 0)) + "%"};
    };

    const handleClick = () => {
        if (globalSideMenuData.openMenuName !== props.name) {
            dispatch(setOpenName(props.name));
        }
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        sendToState({type: "TOUCH_START", payload: event});
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        sendToState({type: "TOUCH_MOVE", payload: event});
    };

    const handleTouchEnd = () => {
        sendToState("TOUCH_END");
    };

    return (
        <div ref={ref} style={getStyle()} className={getClassName()}
             onClick={handleClick}
             onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            {props.children}
        </div>
    );
}

export default SideMenu;