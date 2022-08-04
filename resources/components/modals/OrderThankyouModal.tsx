import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {revertNameToDefault as revertModalNameToDefault} from "../../redux/slices/modalSlice";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import Button from "../commons/Button";

import "../../styles/modals/OrderThankYouModal.scss";

const modalName = "orderThankYou";

function OrderThankYouModal() {
    const dispatch = useAppDispatch();

    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate] = useTranslations(languageCode);

    const onClose = async () => {
        dispatch(revertModalNameToDefault());
    };

    return (
            <Modal name={modalName} className="elevation-vh-15">
                <ModalHeader title={translate("Order Confirmed", "Dialog")}/>
                <ModalBody>
                    <p>{translate("Thank you for your order!", "Texts")}</p>
                    <p>{translate("We will contact you as soon as possible.", "Texts")}</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>{translate("Close", "Actions")}</Button>
                </ModalFooter>
            </Modal>
    );
}

export default OrderThankYouModal;