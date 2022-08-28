import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../../redux/hooks";
import {useTranslations} from "../../../adapters/translatorAdapter";
import {
    setFullName as setAccountFullName,
    setPhone as setAccountPhone,
    setAddress as setAccountAddress,
    validators as accountValidators,
    errorMessages as accountErrorMessages
} from "../../../redux/slices/accountSlice";

import TextInput from "../../commons/Input/TextInput";
import TextArea, {TextAreaElement} from "../../commons/TextArea";
import Form from "../../commons/Form";
import SubmitButton, {SubmitButtonElement} from "./AccountForm/SubmitButton";
import {BaseInputElement} from "../../commons/Input/BaseInput"

function SettingsSceneAccountForm() {
    const dispatch = useAppDispatch();

    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(localeCode);

    let fullNameInputRef = React.useRef<BaseInputElement>();
    let phoneInputRef = React.useRef<BaseInputElement>();
    let addressInputRef = React.useRef<TextAreaElement>();
    let submitButtonRef = React.useRef<SubmitButtonElement>();

    const validateForm = () => {
        return phoneInputRef.current.validate();
    };

    const onOrderEndpointDataSubmit = () => {
        if (!validateForm()) {
            return;
        }

        dispatch(setAccountFullName(fullNameInputRef.current.getValue()));
        dispatch(setAccountPhone(phoneInputRef.current.getValue()));
        dispatch(setAccountAddress(addressInputRef.current.getValue()));

        submitButtonRef.current.triggerEffect();
    };

    return (
        <Form onSubmit={onOrderEndpointDataSubmit}>
            <TextInput ref={fullNameInputRef} label={translate("Full name", "General")}/>
            <TextInput ref={phoneInputRef} label={translate("Phone", "General")} validator={accountValidators.phone} invalid_title={accountErrorMessages.phone}/>
            <TextArea ref={addressInputRef} rows={4}
                      label={translate("Address", "General")}/>
            <div className="text-right">
                <SubmitButton ref={submitButtonRef} onClick={onOrderEndpointDataSubmit}/>
            </div>
        </Form>
    );
}

export default SettingsSceneAccountForm;