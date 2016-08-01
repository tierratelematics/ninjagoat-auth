import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import IAuthConfig from "../interfaces/IAuthConfig";
const Auth0 = require("auth0-js");
import {ISettingsManager} from "ninjagoat";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import * as Promise from "bluebird";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    auth:any;

    constructor(@inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("ISettingsManager") private settingsManager:ISettingsManager,
                @inject("ILocationNavigator") private locationNavigator:ILocationNavigator) {
        this.auth = new Auth0({
            domain: this.authConfig.clientNamespace,
            clientID: this.authConfig.clientId
        });
    }

    login(username:string, password:string):Promise<void> {
        return new Promise<void>((resolve, reject)=> {
            this.auth.signin({
                connection: 'Username-Password-Authentication',
                username: username,
                password: password
            }, (error, profile, idToken, accessToken) => {
                if (error) return reject(error);
                this.settingsManager.setValue("auth_id_token", idToken);
                this.settingsManager.setValue("auth_access_token", accessToken);
                this.settingsManager.setValue("auth_profile", profile);
                resolve();
            });
        });
    }

    signup(username:string, password:string):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.auth.signup({
                connection: 'Username-Password-Authentication',
                username: username,
                password: password
            }, function (err) {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    logout():Promise<void> {
        let url = `https://${this.authConfig.clientNamespace}/v2/logout?returnTo=${this.authConfig.logoutCallbackUrl}&client_id=${this.authConfig.clientId}`;
        this.locationNavigator.navigate(url);
        return Promise.resolve();
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