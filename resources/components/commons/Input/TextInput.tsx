import * as React from 'react';
import * as zod from "zod";

import BaseInput, {BaseInputElement, BaseInputProps} from "./BaseInput";

export const TextInputPropsValidator = zod.object({
    label: zod.string().min(1).optional()
});

const TextInput: React.ForwardRefRenderFunction<BaseInputElement, BaseInputProps> = (props, ref) => {
    TextInputPropsValidator.passthrough().parse(props);

    const getClassName = (): string => {
        let classNameString = "text-input";
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    return (
        <BaseInput type="text" {...props} ref={ref} className={getClassName()}/>
    );
};

export default React.forwardRef(TextInput);