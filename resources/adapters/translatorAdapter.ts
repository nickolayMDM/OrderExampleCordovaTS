import objectHelpers from "../helpers/objects";
import stringHelpers from "../helpers/strings";
import errorHelpers from "../helpers/error";
import validators from "../helpers/validators";

import uaTranslationsFile from "../translations/ua";
import enTranslationsFile from "../translations/en";

export type TranslationList = { [key: string]: (string | TranslationList) };
export type TranslationFiles = { [key: string]: TranslationList };
export type VariablesList = { [key: string]: string };
export type Translate = (string: string, domain?: string, variables?: VariablesList) => string;
export type PickTranslation = (list: TranslationList, variables?: VariablesList) => string;
export type UseTranslations = [
    Translate,
    PickTranslation
];

let translationFiles: TranslationFiles = {
    "ua": uaTranslationsFile,
    "en": enTranslationsFile
};

export const pickTranslation = (locale: string, list: TranslationList, variables?: VariablesList): string => {
    if (!list.hasOwnProperty(locale)) {
        return "";
    }

    let string = <string>list[locale];
    string = applyVariables(string, variables);

    return string;
};

export const translate = (locale: string, string: string, domain: string, variables?: VariablesList): string => {
    if (!translationFiles.hasOwnProperty(locale)) {
        errorHelpers.throwError("could not find the translations for locale " + locale);
    }

    const translationList: TranslationList = translationFiles[locale];

    if (validators.isDefined(domain)) {
        let keys = objectHelpers.transformStringWithDelimitersToArray(".", domain);
        keys.push(string);
        let result = objectHelpers.findNestedPropertyInObject(translationList, keys);
        if (typeof result === "string") {
            string = result;
        }
    } else if (translationList.hasOwnProperty(string)) {
        string = <string>translationList[string];
    }

    string = applyVariables(string, variables);

    return string;
};

export const applyVariables = (inputString: string, variables: VariablesList): string => {
    if (!validators.isPopulatedObject(variables) || inputString.indexOf("{") === -1 || inputString.indexOf("}") === -1) {
        return inputString;
    }

    return stringHelpers.replacePlaceholders({
        body: inputString,
        replacements: variables
    });
};

export const useTranslations = (locale: string): UseTranslations => {
    return [
        translate.bind(null, locale),
        pickTranslation.bind(null, locale)
    ];
};

export default {
    translate,
    pickTranslation,
    applyVariables,
    useTranslations
};