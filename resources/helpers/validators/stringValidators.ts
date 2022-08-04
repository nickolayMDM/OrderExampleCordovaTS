import validators from "../validators";

export const isCountryCode = (value: string): boolean => {
    const regularExpression = /^[a-z]{2}$/;
    return regularExpression.test(value);
};

export const isEmail = (value: string): boolean => {
    const regularExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(value.toLowerCase());
};

export const isIP = (value: string): boolean => {
    const regularExpression = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regularExpression.test(value);
};

export const isPopulatedString = (value: string): boolean => {
    if (validators.isNull(value) || !validators.isDefined(value)) {
        return false;
    }

    return value.length > 0;
};

export const isMD5Hash = (value: string): boolean => {
    const regularExpression = /^[a-f0-9]{32}$/;
    return regularExpression.test(value);
};

export const isJsonString = (value: string): boolean => {
    try {
        let object = JSON.parse(value);

        if (object && typeof object === "object") {
            return true;
        }
    } catch (e) {
    }

    return false;
};

export const isUrl = (value: string): boolean => {
    let url;

    try {
        url = new URL(value);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
};

export const isString = (value: string): boolean => {
    return typeof value === "string";
};

export const isUAPhone = (value: string): boolean => {
    const regularExpression = /^\+?\d{10,12}$/;
    return regularExpression.test(value);
};

export const isLocaleCode = (value: string): boolean => {
    const regularExpression = /^[a-z]{2}$/;
    return regularExpression.test(value);
};

export default {
    isCountryCode, isEmail, isIP, isPopulatedString, isMD5Hash, isJsonString, isUrl, isString, isUAPhone, isLocaleCode
};