export const isNonNegativeInteger = (value: number): boolean => {
    return (Number.isInteger(value) && value >= 0);
};

export const isPositiveInteger = (value: number): boolean => {
    return (Number.isInteger(value) && value > 0);
};

export const isInt = (value: number): boolean => {
    return Number.isInteger(value);
};

export const isTimestamp = (value: number): boolean => {
    const newTimestamp = new Date(value).getTime();
    return isNumeric(newTimestamp);
};

export const isNumeric = (value: number): boolean => {
    return !isNaN(value) && isFinite(value);
};

export default {
    isNonNegativeInteger, isPositiveInteger, isInt, isTimestamp, isNumeric
};