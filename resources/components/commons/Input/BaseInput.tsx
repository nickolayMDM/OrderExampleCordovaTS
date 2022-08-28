import * as React from 'react';
import * as zod from "zod";
import validators from "../../../helpers/validators";
import stringHelpers from "../../../helpers/strings";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import PopupTitle from "../PopupTitle";

import "../../../styles/commons/Input.scss";

export const BaseInputPropsValidator = zod.object({
    label: zod.string().min(1).optional(),
    invalid_title: zod.string().min(1).optional(),
    validator: zod.function().args(zod.string()).returns(zod.boolean()).optional()
});

const stateMachine = createMachine({
    id: 'baseinput',
    initial: "loading",
    context: {
        id: "",
        value: ""
    },
    states: {
        loading: {
            entry: ["load"],
            on: {
                LOADED: {
                    target: "active"
                }
            }
        },
        error: {
            on: {
                LOAD: {
                    target: "loading"
                },
                HIDE_ERROR: {
                    target: "active"
                },
                VALIDATION_SUCCEEDED: {
                    target: "active"
                }
            }
        },
        active: {
            on: {
                LOAD: {
                    target: "loading"
                },
                VALUE_CHANGE: {
                    actions: ["setValue"]
                },
                VALIDATE: {
                    actions: ["validate"]
                },
                VALIDATION_FAILED: {
                    target: "error"
                }
            }
        }
    }
});

export interface BaseInputProps extends React.ComponentPropsWithRef<"input"> {
    label?: zod.infer<typeof BaseInputPropsValidator._shape.label>,
    invalid_title?: zod.infer<typeof BaseInputPropsValidator._shape.invalid_title>,
    validator?: zod.infer<typeof BaseInputPropsValidator._shape.validator>
}

export interface BaseInputElement {
    setValue: (value: string) => void,
    validate: () => boolean,
    getValue: () => string
}

const BaseInput: React.ForwardRefRenderFunction<BaseInputElement, BaseInputProps> = (props, ref) => {
    BaseInputPropsValidator.passthrough().parse(props);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            load: (context) => {
                let newIdString = getIdString();
                context.id = newIdString;

                sendToState("LOADED");
            },
            validate: (context) => {
                if (!isValid(context.value)) {
                    sendToState("VALIDATION_FAILED");
                    return;
                }

                sendToState("VALIDATION_SUCCEEDED");
            },
            setValue: (context, event) => {
                context.value = event.payload;
            }
        }
    });

    const getIdString = (): string => {
        if (props.id) {
            return props.id;
        }

        if (!props.id && props.label) {
            return stringHelpers.getMd5(props.label);
        }

        return null;
    };

    const isValid = (value: string): boolean => {
        if (validators.isFunction(props.validator)) {
            return props.validator(value);
        }

        return true;
    };

    const renderLabel = () => {
        if (!validators.isPopulatedString(props.label)) {
            return "";
        }

        return <label htmlFor={currentState.context.id}>{props.label}</label>
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (validators.isFunction(props.onChange)) {
            props.onChange(event);
        }

        sendToState({type: "VALUE_CHANGE", payload: event.target.value});
    };

    const onFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (validators.isFunction(props.onFocus)) {
            props.onFocus(event);
        }

        sendToState("HIDE_ERROR");
    };

    const hasError = () => {
        return currentState.value === "error";
    };

    const getClassName = () => {
        let classNameString = "input";
        if (hasError()) {
            classNameString += " input-error";
        }
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const renderErrorPopup = () => {
        if (validators.isPopulatedString(props.invalid_title)) {
            return (
                <PopupTitle display={hasError()}>
                    {props.invalid_title}
                </PopupTitle>
            );
        }

        return "";
    };

    React.useImperativeHandle(ref, () => ({
        setValue: zod.function().args(zod.string()).implement((value) => {
            sendToState({type: "VALUE_CHANGE", payload: value});
        }),
        getValue: zod.function().returns(zod.string()).implement(() => {
            return currentState.context.value;
        }),
        validate: zod.function().returns(zod.boolean()).implement(() => {
            sendToState("VALIDATE");

            return isValid(currentState.context.value);
        })
    }));

    const getInputProps = () => {
        let inputProps = {
            ...props
        }

        delete inputProps.validator;

        return inputProps;
    };

    return (
        <div className="input-wrapper">
            {renderLabel()}
            <input {...getInputProps()} id={currentState.context.id} value={currentState.context.value} onFocus={onFocus}
                   onChange={handleChange}
                   className={getClassName()}/>
            {renderErrorPopup()}
        </div>
    );
};

export default React.forwardRef(BaseInput);