import * as React from 'react';
import * as zod from "zod";

export const ModalBodyPropsValidator = zod.object({
    className: zod.string().min(1).optional()
});

export interface ModalBodyProps {
    className?: zod.infer<typeof ModalBodyPropsValidator._shape.className>,
    children?: React.ReactNode
}

function ModalBody(props: ModalBodyProps) {
    ModalBodyPropsValidator.passthrough().parse(props);

    const getClassName = () => {
        let classNameString = "modal-body";
        if (typeof props.className === "string") {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    return (
        <div className={getClassName()}>
            {props.children}
        </div>
    );
}

export default ModalBody;