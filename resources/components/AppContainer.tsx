import * as React from 'react';
import {useAppSelector} from "../redux/hooks";

const switchTimeoutTimeMS = 300;

function AppContainer(props: React.PropsWithChildren<{}>) {
    const languageCode = useAppSelector((state) => state.language.localeCode);
    const globalColorModeName = useAppSelector((state) => state.colorMode.name);

    let [switchTimeout, setSwitchTimeout] = React.useState(null as ReturnType<typeof setTimeout>);
    let [newColorModeTimeout, setNewColorModeTimeout] = React.useState(null as ReturnType<typeof setTimeout>);
    let [isSwitching, setIsSwitching] = React.useState(false);
    let [renderedColorModeName, setRenderedColorModeName] = React.useState(globalColorModeName);

    React.useEffect(() => {
        if (renderedColorModeName !== globalColorModeName) {
            initiateSwitch();
        }
    }, [globalColorModeName]);

    const initiateSwitch = () => {
        clearTimeout(switchTimeout);
        clearTimeout(newColorModeTimeout);

        setIsSwitching(true);

        setNewColorModeTimeout(setTimeout(setNewColorMode, 0));
        setSwitchTimeout(setTimeout(endSwitch, switchTimeoutTimeMS))
    };

    const setNewColorMode = () => {
        setRenderedColorModeName(globalColorModeName);
    };

    const endSwitch = () => {
        setIsSwitching(false);
    };

    const getClassName = () => {
        let classNameString = "app-mode-" + renderedColorModeName + " app-language-" + languageCode;
        if (isSwitching) {
            classNameString += " switching-modes";
        }

        return classNameString;
    };

    return (
        <div id="app" className={getClassName()}>
            {props.children}
        </div>
    );
}

export default AppContainer;