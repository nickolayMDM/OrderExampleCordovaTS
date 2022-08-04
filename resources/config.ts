export type LocalesList = {[key: string]: {label: string}};

export const defaultLocaleCode: string = "ua";

export const locales: LocalesList = {
    en: {
        label: "English"
    },
    ua: {
        label: "Українська"
    },
};

export const defaultColorModeName: string = "bright";

export const availableColorModeNames: string[] = [
    "bright",
    "dark"
];

export const stateInstantFadeMS: number = 10;