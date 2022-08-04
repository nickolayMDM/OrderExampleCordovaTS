import * as React from 'react';
import validators from "../../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../../redux/hooks";
import {useTranslations} from "../../../adapters/translatorAdapter";
import {setFullName as setAccountFullName, setPhone as setAccountPhone, setAddress as setAccountAddress} from "../../../redux/slices/accountSlice";

import TextInput from "../../commons/Input/TextInput";
import TextArea, {TextAreaElement} from "../../commons/TextArea";
import Form from "../../commons/Form";
import Button from "../../commons/Button"
import {BaseInputElement} from "../../commons/Input/BaseInput"

const transitionTimeMS = 1000;

//TODO: add xstate to button
function SettingsSceneAccountForm() {
    const dispatch = useAppDispatch();

    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(localeCode);

    let [isUserDataSaving, setIsUserDataSaving] = React.useState(false);
    let [saveButtonFadeClassName, setSaveButtonFadeClassName] = React.useState("");
    let fullNameInputRef = React.useRef<BaseInputElement>();
    let phoneInputRef = React.useRef<BaseInputElement>();
    let addressInputRef = React.useRef<TextAreaElement>();

    const onOrderEndpointDataSubmit = () => {
        if (isUserDataSaving) {
            return;
        }

        dispatch(setAccountFullName(fullNameInputRef.current.getValue()));
        dispatch(setAccountPhone(phoneInputRef.current.getValue()));
        dispatch(setAccountAddress(addressInputRef.current.getValue()));

        setIsUserDataSaving(true);
        setSaveButtonFadeClassName("button-success");

        setTimeout(() => {
            setSaveButtonFadeClassName("transition-all-slow");
        }, 500);
        setTimeout(() => {
            setIsUserDataSaving(false);
            setSaveButtonFadeClassName("");
        }, transitionTimeMS)
    };

    const getSaveButtonClassName = () => {
        let className = "save-button form-margin";

        if (validators.isPopulatedString(saveButtonFadeClassName)) {
            className += " " + saveButtonFadeClassName;
        }

        return className;
    };

    const getSaveButtonText = () => {
        if (isUserDataSaving) {
            return translate("Saved", "Actions");
        }

        return translate("Save", "Actions");
    };

    return (
        <Form onSubmit={onOrderEndpointDataSubmit}>
            <TextInput ref={fullNameInputRef} label={translate("Full name", "General")}/>
            <TextInput ref={phoneInputRef} label={translate("Phone", "General")}/>
            <TextArea ref={addressInputRef} rows={4}
                      label={translate("Address", "General")}/>
            <div className="text-right">
                <Button className={getSaveButtonClassName()}
                        onClick={onOrderEndpointDataSubmit}>{getSaveButtonText()}</Button>
            </div>
        </Form>
    );
}

export default SettingsSceneAccountForm;