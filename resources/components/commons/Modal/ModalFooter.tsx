import * as React from 'react';

export interface ModalFooterProps {
    children?: React.ReactNode
}

function ModalFooter(props: ModalFooterProps) {
    return (
        <div className="modal-footer">
            {props.children}
        </div>
    );
}

export default ModalFooter;