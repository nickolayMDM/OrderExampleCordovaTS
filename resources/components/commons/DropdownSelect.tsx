import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import stringHelpers from "../../helpers/strings";

export const DropdownSelectPropsValidator = zod.object({
    value: zod.string().min(1).optional(),
    label: zod.string().min(1).optional()
});

export interface DropdownSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    value?: zod.infer<typeof DropdownSelectPropsValidator._shape.value>,
    label?: zod.infer<typeof DropdownSelectPropsValidator._shape.label>
}

function DropdownSelect(props: DropdownSelectProps) {
    DropdownSelectPropsValidator.passthrough().parse(props);

    let [id, setId] = React.useState(null as string);

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
        setId(getIdString());
    }, [props.id, props.label]);

    const getWrapperClassName = () => {
        let classNameString = "input-wrapper select-wrapper";
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const getClassName = () => {
        let classNameString = "input dropdown-select";
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const render = () => {
        if (validators.isPopulatedString(props.label)) {
            return (
                <div className={getWrapperClassName()}>
                    <label htmlFor={id}>{props.label}</label>
                    <select {...props} className="input dropdown-select"/>
                </div>
            );
        }

        return (
            <select {...props} className={getClassName()}/>
        );
    };

    return render();
}

export default DropdownSelect;