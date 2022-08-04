import * as zod from "zod";

export const IdValidator = zod.number().int().nonnegative();

export const PriceValidator = zod.number().nonnegative();

export const CounterValidator = zod.number().int().nonnegative();