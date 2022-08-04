export const convertCatchError = (error: any): Error => {
    if (error instanceof Error) {
        return error;
    }

    return new Error(String(error));
};

const throwError = (message: string): void => {
    throw Error(message);
};

export default {
    convertCatchError,
    throwError
};