import * as zod from "zod";
import {IdValidator, PriceValidator, CounterValidator} from "./basic";
import {LocaleStringListValidator} from "./locales";

export const ProductValidator = zod.object({
    ID: zod.number().int().nonnegative(),
    name: LocaleStringListValidator,
    description: LocaleStringListValidator,
    imageName: zod.string().min(1).optional(),
    categoryID: IdValidator,
    price: PriceValidator,
    inWishlist: zod.boolean(),
    inCart: CounterValidator,
    shouldShowOutsideOfCategory: zod.boolean().optional()
});