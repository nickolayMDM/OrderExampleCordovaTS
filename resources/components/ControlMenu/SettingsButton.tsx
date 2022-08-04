import * as React from 'react';
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {useTranslations} from "../../adapters/translatorAdapter";
import {setName as setSceneName} from "../../redux/slices/sceneSlice";

import Svg from "../commons/Svg";

import * as settingsImage from "../../images/settings.svg";

function SettingsButton() {
    const dispatch = useAppDispatch();

    let languageCode = useAppSelector((state) => state.language.localeCode);
    const [translate] = useTranslations(languageCode);

    const openSettingsScene = () => {
        dispatch(setSceneName("settings"));
    };

    return (
        <div className="settings-button" onClick={openSettingsScene}>
            <Svg src={settingsImage.default} width={22} height={22}/>
            <p className="description-text">{translate("Settings", "General")}</p>
        </div>
    );
}

export default SettingsButton;