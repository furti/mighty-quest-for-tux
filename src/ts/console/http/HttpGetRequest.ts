import { HttpRequestBase } from './HttpRequestBase';

export class HttpGetRequest<ResponseType> extends HttpRequestBase<ResponseType> {
    constructor(url: string) {
        super(url);
    }

    protected sendRequest(request: XMLHttpRequest, url: string): void {
        request.open('GET', url, true);
        request.send();
    }
}