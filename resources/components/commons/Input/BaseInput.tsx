import * as React from 'react';
import * as zod from "zod";
import validators from "../../../helpers/validators";
import stringHelpers from "../../../helpers/strings";

import PopupTitle from "../PopupTitle";

import "../../../styles/commons/Input.scss";

export const BaseInputPropsValidator = zod.object({
    label: zod.string().min(1).optional(),
    invalid_title: zod.string().min(1).optional(),
    validator: zod.function().args(zod.string()).returns(zod.boolean()).optional()
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

    const getIdString = (): string => {
        if (props.id) {
            return props.id;
        }

        if (!props.id && props.label) {
            return stringHelpers.getMd5(props.label);
        }

        return null;
    };

    const getValueString = (): string => {
        let value = props.value as string;
        if (validators.isPopulatedString(value)) {
            return value;
        }

        return "";
    };

    let [id, setId] = React.useState(null as string);
    let [value, setValue] = React.useState("");
    let [hasError, setHasError] = React.useState(false);
    let [customErrorMessage, setCustomErrorMessage] = React.useState("");
    let [customErrorMessageTimeout, setCustomErrorMessageTimeout]  = React.useState(null as ReturnType<typeof setTimeout>);

    React.useEffect(() => {
        setId(getIdString());
        setValue(getValueString());
    }, []);

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

    const renderLabel = () => {
        if (!validators.isPopulatedString(props.label)) {
            return "";
        }

        return <label htmlFor={id}>{props.label}</label>
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (validators.isFunction(props.onChange)) {
            props.onChange(event);
        }

        setValue(event.target.value);
    };

    const onFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (validators.isFunction(props.onFocus)) {
            props.onFocus(event);
        }

        if (hasError) {
            clearTimeout(customErrorMessageTimeout);
            setHasError(false);
            setCustomErrorMessageTimeout(setTimeout(() => {
                setCustomErrorMessage("");
            }, 300))
        }
    };

    const getClassName = () => {
        let classNameString = "input";
        if (hasError) {
            classNameString += " input-error";
        }
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const renderErrorPopup = () => {
        if (validators.isPopulatedString(customErrorMessage)) {
            return (
                <PopupTitle display={hasError}>
                    {customErrorMessage}
                </PopupTitle>
            );
        }

        if (validators.isPopulatedString(props.invalid_title)) {
            return (
                <PopupTitle display={hasError}>
                    {props.invalid_title}
                </PopupTitle>
            );
        }

        return "";
    };

    React.useImperativeHandle(ref, () => ({
        setValue: zod.function().args(zod.string()).implement((value) => {
            setValue(value);
        }),
        getValue: zod.function().returns(zod.string()).implement(() => {
            return String(value);
        }),
        validate: zod.function().returns(zod.boolean()).implement(() => {
            return validate();
        })
    }));

    return (
        <div className="input-wrapper">
            {renderLabel()}
            <input {...props} id={id} value={value} onFocus={onFocus}
                   onChange={handleChange}
                   className={getClassName()}/>
            {renderErrorPopup()}
        </div>
    );
};

export default React.forwardRef(BaseInput);