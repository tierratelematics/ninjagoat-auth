import {IHttpClient, HttpResponse, Dictionary} from "ninjagoat";
import {Observable} from "rx";

class MockHttpClient implements IHttpClient {

    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse> {
        return undefined;
    }

    post(url: string, body: any, headers?: Dictionary<string>): Observable<HttpResponse> {
        return undefined;
    }

    put(url: string, body: any, headers?: Dictionary<string>): Observable<HttpResponse> {
        return undefined;
    }

    delete(url: string, headers?: Dictionary<string>): Observable<HttpResponse> {
        return undefined;
    }

}

export default MockHttpClient
