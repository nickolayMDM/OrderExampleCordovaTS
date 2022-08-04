import numberValidators from "./numberValidators";

export const isOkStatus = (value: number): boolean => {
    return (numberValidators.isInt(value) && value >= 200 && value < 300);
};

export default {
    isOkStatus
};