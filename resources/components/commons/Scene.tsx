import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {setName as setSceneName, addAvailableName as addAvailableSceneName} from "../../redux/slices/sceneSlice";

import "../../styles/commons/Scene.scss";

export const ScenePropsValidator = zod.object({
    name: zod.string().min(1),
    className: zod.string().min(1).optional(),
    activate: zod.boolean().optional()
});

function Scene(props: React.PropsWithChildren<zod.infer<typeof ScenePropsValidator>>) {
    ScenePropsValidator.passthrough().parse(props);

    const dispatch = useAppDispatch();

    let globalSceneName = useAppSelector((state) => state.scene.name);
    let [isShown, setIsShown] = React.useState((validators.isDefined(props.activate)) ? props.activate : false);

    React.useEffect(() => {
        dispatch(addAvailableSceneName(props.name));
        if (props.activate) {
            dispatch(setSceneName(props.name));
        }
    }, []);

    const hideScene = () => {
        setIsShown(false);
    };

    const showScene = () => {
        setIsShown(true);
    };

    const switchScene = () => {
        if (globalSceneName === props.name) {
            showScene();
            return;
        }

        hideScene();
    };

    React.useEffect(() => {
        switchScene();
    }, [globalSceneName, props.name]);

    const getClassName = () => {
        let classNameString = "scene scene-" + props.name;
        if (!isShown) {
            classNameString += " hidden";
        }
        if (validators.isPopulatedString(props.className)) {
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

export default Scene;