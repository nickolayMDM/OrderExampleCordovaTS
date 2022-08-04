import validators from "./validators";

export const transformStringWithDelimitersToArray = (delimiter: string, string: string): string[] => {
    if (!string.includes(delimiter)) return [string];
    let stringArray = string.split(delimiter);

    return stringArray;
};
export const findNestedPropertyInObject = (object: object, keys: (string | string[])): any => {
    if (typeof keys === "string") {
        keys = transformStringWithDelimitersToArray(".", keys);
    }

    let iterate = function (object: any, keys: string[]): any {
        if (
            (typeof object === "string" && keys.length >= 1)
            || (typeof object !== "string" && keys.length < 1)
        ) {
            return false;
        }
        if (typeof object === "string" && keys.length < 1) {
            return object;
        }
        if (!validators.isPopulatedObject(object)) {
            return false;
        }

        let key = keys.shift();
        return iterate(object[key], keys);
    };

    return iterate(object, keys);
};

export const areObjectsSimilar = (first: object, second: object) => {
    return JSON.stringify(first) === JSON.stringify(second);
};

export default {
    transformStringWithDelimitersToArray,
    findNestedPropertyInObject,
    areObjectsSimilar
};