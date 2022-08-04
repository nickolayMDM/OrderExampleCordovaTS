import numberValidators from "./validators/numberValidators";
import objectValidators from "./validators/objectValidators";
import restValidators from "./validators/restValidators";
import stringValidators from "./validators/stringValidators";
import timeValidators from "./validators/timeValidators";

const isDefined = (value: any) => {
    return (typeof value !== "undefined");
};

const isNull = (value: any) => {
    return (value === null);
};

const isBoolean = (value: any) => {
    return (typeof value === "boolean");
};

const isFunction = (value: any) => {
    return typeof value === "function";
};

export default {
    ...numberValidators, ...objectValidators, ...restValidators, ...stringValidators, ...timeValidators,
    isDefined, isNull, isBoolean, isFunction
};