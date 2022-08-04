import * as React from 'react';
import * as zod from "zod";
import validators from "../../helpers/validators";
import request from "../../adapters/requestAdapter";
import DOMParser from "../../adapters/DOMParserAdapter";

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

//TODO: add xstate
function Svg(props: SvgProps) {
    SvgPropsValidator.passthrough().parse(props);

    let [viewBox, setViewBox] = React.useState("0, 0, 0, 0");
    let [paths, setPaths] = React.useState("");

    const getInlinePaths = async () => {
        const requestResult = await request.get({url: props.src});


        const document = DOMParser.parseFromString({
            string: requestResult.response
        });

        const svg = document.getElementsByTagName("svg")[0];
        const viewBox = svg.getAttribute("viewBox");
        const svgChildren = svg.children;
        let svgChildrenString = "";
        for (let key = 0; key < svgChildren.length; key++) {
            svgChildrenString += svgChildren[key].outerHTML;
        }

        setViewBox(viewBox);
        setPaths(svgChildrenString);
    };

    React.useEffect(() => {
        getInlinePaths();
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
             xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={viewBox}
             dangerouslySetInnerHTML={{__html: paths}}>
        </svg>
    );
}

export default Svg;