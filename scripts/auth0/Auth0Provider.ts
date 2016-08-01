import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import IAuthConfig from "../interfaces/IAuthConfig";
import {IHttpClient} from "ninjagoat";
//Needed cause auth0-lock and doesn't work since document is not found
const Auth0Lock = typeof document === "undefined" ? null : require("auth0-lock").default;
import {ISettingsManager} from "ninjagoat";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    constructor(@inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("IHttpClient") private httpClient:IHttpClient,
                @inject("ISettingsManager") private settingsManager:ISettingsManager,
                @inject("ILocationNavigator") private locationNavigator:ILocationNavigator) {

    }

    login() {
        let lock = new Auth0Lock(this.authConfig.clientId, this.authConfig.clientNamespace, {
            auth: {
                redirectUrl: this.authConfig.loginCallbackUrl,
                responseType: 'token',
                authParams: {
                    scope: 'openid email'
                }
            }
        });
        lock.show();
    }

    callback(accessToken:string, idToken:string) {
        this.settingsManager.setValue("auth_user_data", {
            access_token: accessToken, id_token: idToken
        });
    }

    logout() {
        let url = `https://${this.authConfig.clientNamespace}/v2/logout?returnTo=${this.authConfig.logoutCallbackUrl}&client_id=${this.authConfig.clientId}`;
        this.locationNavigator.navigate(url);
    }

    isLoggedIn():boolean {
        return !!this.getIDToken();
    }

    getAccessToken():string {
        let userData = this.settingsManager.getValue<any>("auth_user_data");
        return userData ? userData.access_token : null;
    }

    getIDToken():string {
        let userData = this.settingsManager.getValue<any>("auth_user_data");
        return userData ? userData.id_token : null;
    }

}

export default Auth0Provider