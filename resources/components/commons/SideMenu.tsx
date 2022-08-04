import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import {useAppSelector, useAppDispatch} from "../../redux/hooks";
import {addAvailableName, setOpenName} from "../../redux/slices/sideMenuSlice";

import "../../styles/commons/SideMenu.scss";

const minStateChangeOffsetPercent = 9;

export const SideMenuPropsValidator = zod.object({
    name: zod.string().min(1),
    className: zod.string().min(1).optional(),
    rightSide: zod.boolean().optional()
});

//TODO: add xstate
function SideMenu(props: React.PropsWithChildren<zod.infer<typeof SideMenuPropsValidator>>) {
    SideMenuPropsValidator.passthrough().parse(props);

    const dispatch = useAppDispatch();

    let ref = React.createRef<HTMLDivElement>();
    let globalSideMenuData = useAppSelector((state) => state.sideMenu);
    let [componentStartPositionX, setComponentStartPositionX] = React.useState(null as number);
    let [touchStartX, setTouchStartX] = React.useState(null as number);
    let [offsetX, setOffsetX] = React.useState(null as number);
    let [isMoving, setIsMoving] = React.useState(false);
    let [isOpened, setIsOpened] = React.useState(false);
    let [isShowed, setIsShowed] = React.useState(false);
    let [isMovingLeft, setIsMovingLeft] = React.useState(false);
    let [isTransitioning, setIsTransitioning] = React.useState(true);

    React.useEffect(() => {
        dispatch(addAvailableName(props.name));
    }, []);

    const isMenuDisplayed = () => {
        if (props.rightSide) {
            return globalSideMenuData.activeRightMenuName === props.name;
        }

        return globalSideMenuData.activeLeftMenuName === props.name;
    };

    React.useEffect(() => {
        if (globalSideMenuData.openMenuName === props.name && !isOpened) {
            setIsOpened(true);
        } else if (globalSideMenuData.openMenuName !== props.name && isOpened) {
            setIsOpened(false);
        }
    }, [globalSideMenuData.openMenuName]);

    React.useEffect(() => {
        if (isMenuDisplayed() && !isShowed) {
            setIsShowed(true);
        } else if (!isMenuDisplayed() && isShowed) {
            setIsShowed(false);
        }
    }, [globalSideMenuData.activeRightMenuName, globalSideMenuData.activeLeftMenuName]);

    const isRightSideMenu = () => {
        return (props.rightSide);
    };

    const getClassName = () => {
        let classNameString = "side-menu side-menu-" + props.name;
        if (isRightSideMenu()) {
            classNameString += " side-menu-right"
        } else {
            classNameString += " side-menu-left";
        }

        if (isTransitioning) {
            classNameString += " transitioning";
        }

        if (isOpened) {
            classNameString += " opened";
        } else if (isShowed) {
            classNameString += " showed";
        }

        if (validators.isPopulatedString(props.className)) {
            classNameString += " " + props.className;
        }

        return classNameString;
    };

    const getStyle = () => {
        if (!isMoving) {
            return {};
        }

        let left = componentStartPositionX + offsetX;

        if (isRightSideMenu()) {
            return {left: Math.max(20, Math.min(left, 103)) + "%"};
        }

        return {left: Math.max(-83, Math.min(left, 0)) + "%"};
    };

    const handleClick = () => {
        if (globalSideMenuData.openMenuName !== props.name && !isOpened) {
            dispatch(setOpenName(props.name));
        }
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const componentLeftPx = ref.current.getBoundingClientRect().left;
        const componentLeftPercent = 100 / window.innerWidth * componentLeftPx;

        setComponentStartPositionX(componentLeftPercent);
        setTouchStartX(event.touches[0].clientX);
        setIsTransitioning(false);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        const offsetX = 100 / window.innerWidth * (event.touches[0].clientX - touchStartX);
        setOffsetX(offsetX);
        let isMovingLeft = false;
        if (isMoving === false && Math.abs(offsetX) > 1) {
            setIsMoving(true);
        }
        if (offsetX < 0) {
            isMovingLeft = true;
        }
        setIsMovingLeft(isMovingLeft);
    };

    const handleTouchEnd = () => {
        if (isMoving === true && Math.abs(offsetX) > minStateChangeOffsetPercent) {
            if (
                (isRightSideMenu() && isMovingLeft)
                || (!isRightSideMenu() && !isMovingLeft)
            ) {
                dispatch(setOpenName(props.name));
            } else {
                dispatch(setOpenName(""));
            }
        }

        setOffsetX(0);
        setTouchStartX(0);
        setIsMoving(false);
        setIsTransitioning(true);
        setComponentStartPositionX(null);
    };

    return (
        <div ref={ref} style={getStyle()} className={getClassName()}
             onClick={handleClick}
             onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            {props.children}
        </div>
    );
}

export default SideMenu;