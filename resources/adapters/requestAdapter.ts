import {notify} from "./notificationAdapter";
import validators from "../helpers/validators";
import eventEmitter from "./eventEmitterAdapter";
import axios, {AxiosResponse, AxiosRequestHeaders, AxiosError} from "axios";

type requestResult = {
    response: string,
    status: number
};
type requestOptions = {
    notifyOnError?: boolean
};

export const get = async (
    {
        url,
        params = {},
        headers = {},
        options = {}
    }: {
        url: string,
        params?: object,
        headers?: AxiosRequestHeaders,
        options?: requestOptions
    }
): Promise<requestResult> => {
    let response: AxiosResponse;

    try {
        response = await axios.get(url, {
            params,
            headers
        });
    } catch (error) {
        response = error.response;

        eventEmitter.emit("d_authorize", error);
        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    let result = {
        response: String(response.data),
        status: response.status
    };

    return result;
};

export const post = async (
    {
        url,
        params,
        headers = {},
        options = {}
    }: {
        url: string,
        params: object,
        headers: AxiosRequestHeaders,
        options: requestOptions
    }
): Promise<requestResult> => {
    let response: AxiosResponse;

    try {
        response = await axios.post(url, params,
            {
                headers: {
                    'Content-Type': 'application/JSON',
                    ...headers
                }
            });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    let result = {
        response: String(response.data),
        status: response.status
    };

    return result;
};

export const put = async (
    {
        url,
        params,
        headers = {},
        options = {}
    }: {
        url: string,
        params: object,
        headers: AxiosRequestHeaders,
        options: requestOptions
    }
): Promise<requestResult> => {
    let response: AxiosResponse;

    try {
        response = await axios.put(url, params,
            {
                headers: {
                    'Content-Type': 'application/JSON',
                    ...headers
                }
            });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    let result = {
        response: String(response.data),
        status: response.status
    };

    return result;
};

export const del = async (
    {
        url,
        params,
        headers = {},
        options = {}
    }: {
        url: string,
        params: object,
        headers: AxiosRequestHeaders,
        options: requestOptions
    }
) => {
    let response: AxiosResponse;

    try {
        response = await axios.delete(url, {
            data: params,
            headers: {
                'Content-Type': 'application/JSON',
                ...headers
            }
        });
    } catch (error) {
        response = error.response;

        if (options.notifyOnError === true) {
            _displayConnectionError(error);
        }
    }

    let result = {
        response: String(response.data),
        status: response.status
    };

    return result;
};

export default {
    get,
    post,
    put,
    del
};

const _displayConnectionError = (error: AxiosError) => {
    if (
        !validators.isPopulatedObject(error.response)
        || !validators.isNumeric(error.response.status)
        || !validators.isPopulatedString(error.response.statusText)
    ) {
        return notify.error("Connection error");
    }

    return notify.error("Connection error: " + error.response.status + " " + error.response.statusText);
};