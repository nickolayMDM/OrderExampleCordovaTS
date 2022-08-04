import * as zod from "zod";
import {locales} from "../config";

export const LocaleEnum = zod.enum(Object.keys(locales) as [string, ...string[]]);

export const LocaleStringListValidator = zod.record(LocaleEnum, zod.string().min(1));

export default {
    LocaleEnum,
    LocaleStringListValidator
};