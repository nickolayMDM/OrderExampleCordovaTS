import * as React from 'react';
import {useAppSelector} from "../../../../redux/hooks";
import {useTranslations} from "../../../../adapters/translatorAdapter";
import * as zod from "zod";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import Button from "../../../commons/Button"

export const SubmitButtonPropsValidator = zod.object({
    onClick: zod.function()
});

const stateMachine = createMachine({
    id: 'submitButton',
    initial: "idle",
    states: {
        idle: {
            on: {
                SUBMIT: {
                    target: "green"
                }
            }
        },
        green: {
            on: {
                SUBMIT: {
                    target: "green"
                }
            },
            after: {
                500: {
                    target: "fading"
                }
            }
        },
        fading: {
            on: {
                SUBMIT: {
                    target: "green"
                }
            },
            after: {
                500: {
                    target: "idle"
                }
            }
        }
    }
});

export interface SubmitButtonElement {
    triggerEffect: () => void
}

export interface SubmitButtonProps {
    ref?: React.RefObject<SubmitButtonElement>,
    onClick: zod.infer<typeof SubmitButtonPropsValidator._shape.onClick>
}

const AccountFormSubmitButton: React.ForwardRefRenderFunction<SubmitButtonElement, SubmitButtonProps> = (props, ref) => {
    SubmitButtonPropsValidator.passthrough().parse(props);

    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(localeCode);

    const [currentState, sendToState] = useMachine(stateMachine);

    const getSaveButtonClassName = () => {
        let className = "save-button form-margin";

        if (currentState.value === "green") {
            className += " button-success";
        } else if (currentState.value === "fading") {
            className += " transition-all-slow";
        }

        return className;
    };

    const getSaveButtonText = () => {
        if (currentState.value !== "idle") {
            return translate("Saved", "Actions");
        }

        return translate("Save", "Actions");
    };

    React.useImperativeHandle(ref, () => ({
        triggerEffect: zod.function().args().implement(() => {
            sendToState("SUBMIT");
        })
    }));

    return (
        <Button className={getSaveButtonClassName()}
                onClick={props.onClick}>{getSaveButtonText()}</Button>
    );
}

export default React.forwardRef(AccountFormSubmitButton);