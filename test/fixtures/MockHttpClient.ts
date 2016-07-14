import {IHttpClient, HttpResponse, Dictionary} from "ninjagoat";

class MockHttpClient implements IHttpClient {

    get(url:string, headers?:Dictionary<string>):Rx.Observable<HttpResponse> {
        return undefined;
    }

    post(url:string, body:any, headers?:Dictionary<string>):Rx.Observable<HttpResponse> {
        return undefined;
    }

    put(url:string, body:any, headers?:Dictionary<string>):Rx.Observable<HttpResponse> {
        return undefined;
    }

    delete(url:string, headers?:Dictionary<string>):Rx.Observable<HttpResponse> {
        return undefined;
    }

}

export default MockHttpClient