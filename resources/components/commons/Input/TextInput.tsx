import * as React from 'react';
import * as zod from "zod";

import BaseInput, {BaseInputElement} from "./BaseInput";

export const TextInputPropsValidator = zod.object({
    label: zod.string().min(1).optional()
});

export interface TextInputProps extends React.ComponentPropsWithRef<"input"> {
    label?: zod.infer<typeof TextInputPropsValidator._shape.label>,
}

const TextInput: React.ForwardRefRenderFunction<BaseInputElement, TextInputProps> = (props, ref) => {
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