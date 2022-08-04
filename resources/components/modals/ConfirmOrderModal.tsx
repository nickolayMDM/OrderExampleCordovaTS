import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setModalName} from "../../redux/slices/modalSlice";
import {setName as setTabName} from "../../redux/slices/tabSlice";
import serverRequester from "../../adapters/serverRequesterAdapter";

import Modal from "../commons/Modal";
import ModalHeader from "../commons/Modal/ModalHeader";
import ModalBody from "../commons/Modal/ModalBody";
import ModalFooter from "../commons/Modal/ModalFooter";
import TextInput from "../commons/Input/TextInput";
import Form from "../commons/Form";
import TextArea, {TextAreaElement} from "../commons/TextArea";
import {BaseInputElement} from "../commons/Input/BaseInput";
import {setInCartTotal, setInCartTotalPrice} from "../../redux/slices/cartSlice";

const modalName = "confirmOrder";

//TODO: add xstate
function ConfirmOrderModal() {
    const dispatch = useAppDispatch();

    let accountFullName = useAppSelector((state) => state.account.fullName);
    let accountAddress = useAppSelector((state) => state.account.address);
    let accountPhone = useAppSelector((state) => state.account.phone);
    let languageCode = useAppSelector((state) => state.language.localeCode);
    let [translate] = useTranslations(languageCode);

    let fullNameInputRef = React.useRef<BaseInputElement>();
    let phoneInputRef = React.useRef<BaseInputElement>();
    let addressInputRef = React.useRef<TextAreaElement>();

    React.useEffect(() => {
    }, [accountFullName, accountPhone, accountAddress]);

    const preFillForm = () => {
        fullNameInputRef.current.setValue(accountFullName);
        phoneInputRef.current.setValue(accountPhone);
        addressInputRef.current.setValue(accountAddress);
    };

    const isFormValid = () => {
        return fullNameInputRef.current.validate() &&
            phoneInputRef.current.validate() &&
            addressInputRef.current.validate();
    };

    const handleFormSubmit = () => {
        serverRequester.clearCart();
        dispatch(setInCartTotal(serverRequester.getInCartTotal()));
        dispatch(setInCartTotalPrice(serverRequester.getInCartTotalPrice()));

        dispatch(setModalName("orderThankYou"));
        dispatch(setTabName("menu"));
    };

    return (
        <Modal name={modalName} className="elevation-vh-15" onOpen={preFillForm}>
            <ModalHeader title={translate("Confirm Order", "Actions")}/>
            <Form validator={isFormValid} handler={handleFormSubmit}>
                <ModalBody>
                    <TextInput ref={fullNameInputRef}
                               label={translate("Full name", "General")}/>
                    <TextInput ref={phoneInputRef} label={translate("Phone", "General")}/>
                    <TextArea ref={addressInputRef} rows={4}
                              label={translate("Address", "General")}/>
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value={translate("Submit", "Actions")}/>
                </ModalFooter>
            </Form>
        </Modal>
    );
}

export default ConfirmOrderModal;