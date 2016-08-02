import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import IAuthConfig from "../interfaces/IAuthConfig";
const Auth0 = typeof  document === "undefined" ? null : require("auth0-js");
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
        if (Auth0)
            this.auth = new Auth0({
                domain: this.authConfig.clientNamespace,
                clientID: this.authConfig.clientId
            });
    }

    login(username:string, password:string):Promise<void> {
        return new Promise<any>((resolve, reject)=> {
            if (!username || !password) return reject(new Error("Some credentials are missing"));
            this.auth.signin({
                connection: 'Username-Password-Authentication',
                username: username,
                password: password
            }, (error, data) => {
                if (error) return reject(error);
                this.settingsManager.setValue("auth_id_token", data.idToken);
                this.settingsManager.setValue("auth_access_token", data.accessToken);
                resolve();
            });
        }).then(() => this.requestProfile());
    }

    signup(username:string, password:string):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!username || !password) return reject(new Error("Some credentials are missing"));
            this.auth.signup({
                connection: 'Username-Password-Authentication',
                username: username,
                password: password
            }, function (error) {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    changePassword(username:string):Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!username) return reject(new Error("Some credentials are missing"));
            this.auth.changePassword({
                connection: 'Username-Password-Authentication',
                email: username
            }, function (error) {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    requestProfile():Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.auth.getProfile(this.getIDToken(), (error, profile) => {
                if (error) return reject(error);
                resolve(profile);
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

}

export default Auth0Provider