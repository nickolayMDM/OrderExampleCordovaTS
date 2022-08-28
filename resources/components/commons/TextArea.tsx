import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import stringHelpers from "../../helpers/strings";
import {createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import PopupTitle from "./PopupTitle";

export const TextAreaPropsValidator = zod.object({
    label: zod.string().min(1),
    invalid_title: zod.string().min(1).optional(),
    validator: zod.function().args(zod.string()).returns(zod.boolean()).optional()
});

const stateMachine = createMachine({
    id: 'textarea',
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

export interface TextAreaProps extends Omit<React.ComponentProps<"textarea">, 'ref'> {
    label: zod.infer<typeof TextAreaPropsValidator._shape.label>,
    invalid_title?: zod.infer<typeof TextAreaPropsValidator._shape.invalid_title>,
    validator?: zod.infer<typeof TextAreaPropsValidator._shape.validator>,
    ref?: React.Ref<TextAreaElement>
}

export interface TextAreaElement {
    setValue: (value: string) => void,
    validate: () => boolean,
    getValue: () => string
}

const TextArea: React.ForwardRefRenderFunction<TextAreaElement, TextAreaProps> = (props, ref) => {
    TextAreaPropsValidator.passthrough().parse(props);

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

    const isValid = (value: string) => {
        if (validators.isFunction(props.validator)) {
            return props.validator(value);
        }

        return true;
    };

    const getIdString = () => {
        if (props.id) {
            return props.id
        }

        if (!props.id && props.label) {
            return stringHelpers.getMd5(props.label)
        }

        return null;
    };

    React.useEffect(() => {
        sendToState("LOAD");
    }, [props.id, props.label]);

    React.useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
            sendToState({type: "VALUE_CHANGE", payload: value});
        },
        getValue: () => {
            return currentState.context.value;
        },
        validate: () => {
            sendToState("VALIDATE");

            return isValid(currentState.context.value);
        }
    }));

    const onFocus = () => {
        sendToState("HIDE_ERROR");
    };

    const renderLabel = () => {
        if (!validators.isPopulatedString(props.label)) {
            return "";
        }

        return <label htmlFor={currentState.context.id}>{props.label}</label>
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        sendToState({type: "VALUE_CHANGE", payload: event.target.value});
    };

    const hasError = () => {
        return currentState.value === "error";
    };

    const getClassName = () => {
        let classNameString = "input text-area";
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

    const getProps = () => {
        return {
            ...props,
            ref: null as React.Ref<HTMLTextAreaElement>
        };
    };

    return (
        <div className="input-wrapper base-input-wrapper">
            {renderLabel()}
            <textarea onFocus={onFocus}
                      onChange={handleChange} {...getProps()}
                      className={getClassName()} value={currentState.context.value}/>
            {renderErrorPopup()}
        </div>
    );
};

export default React.forwardRef(TextArea);