import {IHttpClient} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import {Dictionary} from "ninjagoat";

class AuthHttpClient implements IHttpClient {

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

export default AuthHttpClient