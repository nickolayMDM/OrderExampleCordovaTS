import {Md5} from "md5-typescript";

export const replacePlaceholder = (
    {
        body,
        name,
        replacement
    }: {
        body: string,
        name: string,
        replacement: string
    }
): string => {
    let replaceString = "{" + name + "}";
    return body.replace(replaceString, replacement);
};

export const replacePlaceholders = (
    {
        body,
        replacements
    }: {
        body: string,
        replacements: {[key: string]: string}
    }
) => {
    for (let key in replacements) {
        if (!replacements.hasOwnProperty(key)) continue;
        let value = replacements[key];

        body = replacePlaceholder({
            body,
            name: key,
            replacement: value
        });
    }

    return body;
};

export const trimSpaces = (text: string) => {
    text = text.trim();
    text = text.replace(/\s\s+/g, " ");

    return text;
};

export const getMd5 = (text: string) => {
    return Md5.init(text);
};

export default {
    replacePlaceholder,
    replacePlaceholders,
    trimSpaces,
    getMd5
};