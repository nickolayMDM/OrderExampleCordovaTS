import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";

import "../../styles/commons/Form.scss";

export const FormPropsValidator = zod.object({
    preparation: zod.function().returns(zod.void()).optional(),
    validator: zod.function().returns(zod.boolean()).optional(),
    handler: zod.function().returns(zod.void()).optional()
});

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    preparation?: zod.infer<typeof FormPropsValidator._shape.preparation>,
    validator?: zod.infer<typeof FormPropsValidator._shape.validator>,
    handler?: zod.infer<typeof FormPropsValidator._shape.handler>
}

function Form(props: FormProps) {
    FormPropsValidator.passthrough().parse(props);

    let [error, setError] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (validators.isFunction(props.preparation)) {
            props.preparation();
        }
        setTimeout(() => {
            if (validators.isFunction(props.validator) && !props.validator()) {
                setError(true);
                return;
            }
            if (validators.isFunction(props.handler)) {
                props.handler();
            }
        }, 0);
    };

    const getClassName = () => {
        let classNameString = "form";
        if (error) {
            classNameString += " form-error";
        }
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    return (
        <form onSubmit={handleSubmit} className={getClassName()} onFocus={props.onFocus}>
            {props.children}
        </form>
    );
}

export default Form;