import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import request from "../../adapters/requestAdapter";
import DOMParser from "../../adapters/DOMParserAdapter";
import {actions, assign, createMachine} from "xstate";
import {useMachine} from "@xstate/react";

import "../../styles/commons/Svg.scss";

export const SvgPropsValidator = zod.object({
    src: zod.string().min(1),
    width: zod.number().nonnegative().optional(),
    height: zod.number().nonnegative().optional()
});

export interface SvgProps extends React.SVGProps<SVGSVGElement> {
    src: zod.infer<typeof SvgPropsValidator._shape.src>,
    width?: zod.infer<typeof SvgPropsValidator._shape.width>,
    height?: zod.infer<typeof SvgPropsValidator._shape.height>
}

const stateMachine = createMachine({
    id: 'scene',
    initial: "loading",
    context: {
        viewBox: "0, 0, 0, 0",
        paths: ""
    },
    states: {
        loading: {
            entry: ["load"],
            on: {
                SHOW: {
                    target: "active"
                }
            }
        },
        active: {
            on: {
                LOAD: {
                    target: "loading"
                }
            }
        }
    }
});

function Svg(props: SvgProps) {
    SvgPropsValidator.passthrough().parse(props);

    const [currentState, sendToState] = useMachine(stateMachine, {
        actions: {
            load: async (context) => {
                let svgElement = await getSvgElement();
                let viewBox = getViewBoxFromSvgElement(svgElement);
                let paths = getPathsFromSvgElement(svgElement);
                context.viewBox = viewBox;
                context.paths = paths;

                sendToState("SHOW");
            }
        }
    });

    const getSvgElement = async () => {
        const requestResult = await request.get({url: props.src});

        const document = DOMParser.parseFromString({
            string: requestResult.response
        });

        return document.getElementsByTagName("svg")[0];
    };

    const getViewBoxFromSvgElement = (svgElement: SVGElement) => {
        return svgElement.getAttribute("viewBox");
    };

    const getPathsFromSvgElement = (svgElement: SVGElement) => {
        const svgChildren = svgElement.children;
        let svgChildrenString = "";
        for (let key = 0; key < svgChildren.length; key++) {
            svgChildrenString += svgChildren[key].outerHTML;
        }

        return svgChildrenString;
    };

    React.useEffect(() => {
        sendToState("LOAD");
    }, [props.src]);

    const getClassName = () => {
        let classNameArray = [];
        if (validators.isPopulatedString(props.className)) {
            classNameArray.push(props.className);
        }

        return classNameArray.join(" ");
    };

    return (
        <svg {...props} className={getClassName()} width={props.width}
             height={props.height} xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={currentState.context.viewBox}
             dangerouslySetInnerHTML={{__html: currentState.context.paths}}>
        </svg>
    );
}

export default Svg;