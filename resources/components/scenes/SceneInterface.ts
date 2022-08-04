import * as zod from "zod";

export interface SceneProps {
    activate?: boolean
}

export const ScenePropsValidator = zod.object({
    activate: zod.boolean().optional()
});