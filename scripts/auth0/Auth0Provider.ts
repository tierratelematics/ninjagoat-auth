import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import IAuthConfig from "../interfaces/IAuthConfig";
//Needed cause auth0-lock and doesn't work since document is not found
const Auth0Lock = typeof document === "undefined" ? null : require("auth0-lock").default;
import {ISettingsManager} from "ninjagoat";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import * as Promise from "bluebird";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    protected lock: any;

    constructor(@inject("IAuthConfig") private authConfig: IAuthConfig,
                @inject("ISettingsManager") private settingsManager: ISettingsManager,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {
        if (Auth0Lock)
            this.lock = new Auth0Lock(this.authConfig.clientId, this.authConfig.clientNamespace, {
                auth: {
                    redirectUrl: this.authConfig.loginCallbackUrl,
                    responseType: 'token',
                    authParams: {
                        scope: 'openid email'
                    }
                }
            });
    }

    login() {
        this.lock.show();
    }

    callback(accessToken: string, idToken: string) {
        this.settingsManager.setValue("auth_id_token", idToken);
        this.settingsManager.setValue("auth_access_token", accessToken);
    }

    requestProfile(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.lock.getProfile(this.getIDToken(), (error, profile) => {
                if (error) return reject(error);
                resolve(profile);
            });
        });
    }

    logout(): Promise<void> {
        this.settingsManager.setValue("auth_id_token", null);
        this.settingsManager.setValue("auth_access_token", null);
        this.settingsManager.setValue("auth_profile", null);
        let url = `https://${this.authConfig.clientNamespace}/v2/logout?returnTo=${this.authConfig.logoutCallbackUrl}&client_id=${this.authConfig.clientId}`;
        this.locationNavigator.navigate(url);
        return Promise.resolve();
    }

    isLoggedIn(): boolean {
        return !!this.getIDToken();
    }

    getAccessToken(): string {
        let userData = this.settingsManager.getValue<any>("auth_user_data");
        return userData ? userData.access_token : null;
    }

    getIDToken(): string {
        let userData = this.settingsManager.getValue<any>("auth_user_data");
        return userData ? userData.id_token : null;
    }

}

export default Auth0Provider