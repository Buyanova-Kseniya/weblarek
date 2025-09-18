import {IApi, ApiPostMethods} from '../../types';

export class Api implements IApi {
    readonly url: string;
    readonly cdn: string;
    
    protected options: RequestInit;

    constructor(baseUrl: string, cdnUrl: string, options: RequestInit = {}) {
        this.url = baseUrl;
        this.cdn = cdnUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    get<T>(uri: string) {
        return fetch(this.url + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.url + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}