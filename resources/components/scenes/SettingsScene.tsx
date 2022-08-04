import * as React from 'react';
import {locales, availableColorModeNames} from "../../config";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {ScenePropsValidator} from "./SceneInterface";
import {setLocaleCode} from "../../redux/slices/languageSlice";
import {setName as setColorModeName} from "../../redux/slices/colorModeSlice";

import Scene from "../commons/Scene";
import DropdownSelect from "../commons/DropdownSelect";
import AccountForm from "./SettingsScene/AccountForm";

import "../../styles/scenes/SettingsScene.scss";
import * as zod from "zod";

const sceneName = "settings";

function SettingsScene(props: zod.infer<typeof ScenePropsValidator>) {
    ScenePropsValidator.parse(props);

    const dispatch = useAppDispatch();
    const localeCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(localeCode);

    const getLanguageSelectOptions = () => {
        let options = [];
        let iterator = 0;

        for (let key in locales) {
            options.push(<option key={key} value={key}>{locales[key].label}</option>);
            iterator++;
        }

        return options;
    };

    const getColorModeOptions = () => {
        let options = [];
        let iterator = 0;

        for (let key in availableColorModeNames) {
            options.push(<option key={availableColorModeNames[key]} value={availableColorModeNames[key]}>{availableColorModeNames[key]}</option>);
            iterator++;
        }

        return options;
    };

    const handleLanguageOptionChange = async (event: React.FormEvent<EventTarget>) => {
        let target = event.target as HTMLInputElement;
        dispatch(setLocaleCode(target.value));
    };

    const handleColorModeChange = async (event: React.FormEvent<EventTarget>) => {
        let target = event.target as HTMLInputElement;
        dispatch(setColorModeName(target.value));
    };

    return (
        <Scene name={sceneName} activate={props.activate}>
            <DropdownSelect label={translate("Language", "General")} value={localeCode}
                            onChange={handleLanguageOptionChange}>
                {getLanguageSelectOptions()}
            </DropdownSelect>
            <DropdownSelect className="form-margin" label={translate("Color Scheme", "General")}
                            onChange={handleColorModeChange}>
                {getColorModeOptions()}
            </DropdownSelect>
            <hr/>
            <AccountForm/>
        </Scene>
    );
}

export default SettingsScene;