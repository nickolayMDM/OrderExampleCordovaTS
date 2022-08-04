import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import stringHelpers from "../../helpers/strings";

import PopupTitle from "./PopupTitle";

export const TextAreaPropsValidator = zod.object({
    label: zod.string().min(1),
    invalid_title: zod.string().min(1).optional(),
    validator: zod.function().args(zod.string()).returns(zod.boolean()).optional()
});

export interface TextAreaProps extends Omit<React.ComponentPropsWithRef<"textarea">, 'ref'> {
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

//TODO: add xstate
const TextArea: React.ForwardRefRenderFunction<TextAreaElement, TextAreaProps> = (props, ref) => {
    TextAreaPropsValidator.passthrough().parse(props);

    const getIdString = () => {
        if (props.id) {
            return props.id
        }

        if (!props.id && props.label) {
            return stringHelpers.getMd5(props.label)
        }

        return null;
    };

    let [id, setId] = React.useState(null as string);
    let [value, setValue] = React.useState(props.value);
    let [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        setId(getIdString());
    }, [props.id, props.label]);

    const isValid = (): boolean => {
        if (validators.isFunction(props.validator)) {
            return props.validator(value as string);
        }

        return true;
    };

    const validate = () => {
        let isValidBoolean = isValid();
        setHasError(!isValidBoolean);

        return isValidBoolean;
    };

    React.useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
            setValue(value);
        },
        getValue: () => {
            return String(value);
        },
        validate: () => {
            return validate();
        }
    }));

    const onFocus = () => {
        if (hasError) {
            hasError = false;
        }
    };

    const renderLabel = () => {
        if (!validators.isPopulatedString(props.label)) {
            return "";
        }

        return <label htmlFor={id}>{props.label}</label>
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    };

    const getClassName = () => {
        let classNameString = "input text-area";
        if (hasError) {
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
                <PopupTitle display={hasError}>
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
                      className={getClassName()} value={value}/>
            {renderErrorPopup()}
        </div>
    );
};

export default React.forwardRef(TextArea);