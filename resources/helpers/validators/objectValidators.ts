import validators from "../validators";

export const isWithinObject = (needle: string, haystack: object): boolean => {
    return haystack.hasOwnProperty(needle);
};

export const isWithinArray = <T>(needle: T, haystack: T[]): boolean => {
    return haystack.indexOf(needle) > -1;
};

export const isPopulatedObject = (value: object): boolean => {
    if (validators.isNull(value) || !validators.isDefined(value)) {
        return false;
    }

    return Object.keys(value).length > 0;
};

export const isPopulatedArray = (value: any[]): boolean => {
    return value.length > 0;
};

export default {
    isPopulatedObject, isPopulatedArray, isWithinArray, isWithinObject
};