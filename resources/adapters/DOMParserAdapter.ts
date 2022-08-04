import validators from "../helpers/validators";

let parser: DOMParser;
let isInitialized = false;

const initialize = () => {
    parser = new DOMParser();
    isInitialized = true;
};

const parseFromString = (
    {
        string,
        mimeType
    }: {
        string: string,
        mimeType?: DOMParserSupportedType
    }
) => {
    if (!isInitialized) {
        initialize();
    }
    if (!validators.isPopulatedString(mimeType)) {
        mimeType = "text/html";
    }

    return parser.parseFromString(string, mimeType);
};

export default {
    parseFromString
};