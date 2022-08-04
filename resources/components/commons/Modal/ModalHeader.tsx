import * as React from 'react';
import * as zod from "zod";
import {useAppDispatch} from "../../../redux/hooks";
import {revertNameToDefault as revertModalNameToDefault} from "../../../redux/slices/modalSlice";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'

export const ModalHeaderPropsValidator = zod.object({
    title: zod.string().min(1)
});

function ModalHeader(props: zod.infer<typeof ModalHeaderPropsValidator>) {
    ModalHeaderPropsValidator.parse(props);

    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(revertModalNameToDefault());
    };

    return (
        <div className="modal-header">
            <h2 className="modal-title">{props.title}</h2>
            <FontAwesomeIcon className="modal-header-close" onClick={handleClose} icon={faTimesCircle} size="2x"/>
        </div>
    );
}

export default ModalHeader;