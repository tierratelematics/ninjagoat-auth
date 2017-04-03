import {IHttpClient} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import {Dictionary} from "ninjagoat";
import {inject, injectable} from "inversify";
import {ISettingsManager} from "ninjagoat";
import {merge} from "lodash";
import {Observable} from "rx";

@injectable()
class AuthHttpClient implements IHttpClient {

    constructor(@inject("HttpClient") private httpClient:IHttpClient,
                @inject("ISettingsManager") private settingsManager:ISettingsManager) {

    }

    get(url:string, headers?:Dictionary<string>):Observable<HttpResponse> {
        return this.httpClient.get(url, this.mergeAuthorizationHeader(headers));
    }

    post(url:string, body:any, headers?:Dictionary<string>):Observable<HttpResponse> {
        return this.httpClient.post(url, body, this.mergeAuthorizationHeader(headers));
    }

    put(url:string, body:any, headers?:Dictionary<string>):Observable<HttpResponse> {
        return this.httpClient.put(url, body, this.mergeAuthorizationHeader(headers));
    }

    delete(url:string, headers?:Dictionary<string>):Observable<HttpResponse> {
        return this.httpClient.delete(url, this.mergeAuthorizationHeader(headers));

    }

    private mergeAuthorizationHeader(headers:Dictionary<string>):Dictionary<string> {
        let accessToken = this.settingsManager.getValue<string>('auth_access_token');
        return accessToken ? merge({
            Authorization: 'Bearer ' + accessToken
        }, headers) : headers;
    }
}

export default AuthHttpClient