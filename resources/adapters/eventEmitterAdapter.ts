import * as EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

const Emitter = {
    addListener: (event: string, fn: (callback: object) => void) => eventEmitter.on(event, fn),
    once: (event: string, fn: (callback: object) => void) => eventEmitter.once(event, fn),
    off: (event: string, fn: (callback: object) => void) => eventEmitter.off(event, fn),
    emit: (event: string, payload?: object) => eventEmitter.emit(event, payload)
};

export default Object.freeze(Emitter);