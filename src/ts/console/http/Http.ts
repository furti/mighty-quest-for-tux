import { HttpRequest } from './HttpRequest';
import { HttpGetRequest } from './HttpGetRequest';

export class Http {
    /**
     * Creates a GET request to the specified url.
     * The request can be customized and executed later.
     * Don't reuse the request object as the state is tracked interally.
     */
    public static get<ResponseType>(url: string): HttpRequest<ResponseType> {
        return new HttpGetRequest<ResponseType>(url);
    }
}