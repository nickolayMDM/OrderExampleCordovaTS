export const isFutureTimestamp = (timestamp: number) => {
    const currentTimestamp = Date.now();
    return currentTimestamp < timestamp;
};

export default {
    isFutureTimestamp
};