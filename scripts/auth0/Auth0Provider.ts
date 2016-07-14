import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import IAuthConfig from "../interfaces/IAuthConfig";
import {IHttpClient} from "ninjagoat";
//Needed cause auth0-lock and doesn't work since document is not found
const Auth0Lock = typeof document === "undefined" ? null : require("auth0-lock");
import {ISettingsManager} from "ninjagoat";

@injectable()
class Auth0Provider implements IAuthProvider {

    constructor(@inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("IHttpClient") private httpClient:IHttpClient,
                @inject("ISettingsManager") private settingsManager:ISettingsManager) {

    }

    login() {
        let lock = new Auth0Lock(this.authConfig.clientId, this.authConfig.clientNamespace);
        lock.show({
            callbackURL: this.authConfig.clientCallbackUrl,
            responseType: 'token',
            authParams: {
                scope: 'openid email'
            }
        });
    }

    callback(accessToken:string, idToken:string) {
        this.settingsManager.setValue("auth_user_data", {
            access_token: accessToken, id_token: idToken
        });
    }

    isLoggedIn():boolean {
        return !!this.getIDToken();
    }

    getProfile():Observable<any> {
        return this.httpClient.post(`https://${this.authConfig.clientNamespace}.auth0.com/tokeninfo`, {
            id_token: this.getIDToken()
        });
    }

    getAccessToken():string {
        return this.settingsManager.getValue<any>("auth_user_data").access_token;
    }

    getIDToken():string {
        return this.settingsManager.getValue<any>("auth_user_data").id_token;
    }

}

export default Auth0Provider