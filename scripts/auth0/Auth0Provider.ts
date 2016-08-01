import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import IAuthConfig from "../interfaces/IAuthConfig";
const Auth0 = require("auth0-js");
import {ISettingsManager} from "ninjagoat";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    constructor(@inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("ISettingsManager") private settingsManager:ISettingsManager,
                @inject("ILocationNavigator") private locationNavigator:ILocationNavigator) {

    }

    login(username:string, password:string) {
        let auth = new Auth0({
            domain: this.authConfig.clientNamespace,
            clientID: this.authConfig.clientId
        });
        auth.signin({
            connection: 'Username-Password-Authentication',
            username: username,
            password: password
        }, (error, profile, idToken, accessToken) => {
            if (error)return;
            this.settingsManager.setValue("auth_id_token", idToken);
            this.settingsManager.setValue("auth_access_token", accessToken);
            this.settingsManager.setValue("auth_profile", profile);
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
        return this.settingsManager.getValue<string>("auth_access_token");
    }

    getIDToken():string {
        return this.settingsManager.getValue<string>("auth_id_token");
    }

    getProfile():string {
        return this.settingsManager.getValue<any>("auth_profile");
    }

}

export default Auth0Provider