import { Auth0DecodedHash, ParseHashOptions, WebAuth } from "auth0-js";
import { inject, injectable } from "inversify";
import { assign } from "lodash";
import { ISettingsManager } from "ninjagoat";

import IAuthConfig from "../interfaces/IAuthConfig";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import IAuthProvider from "../interfaces/IAuthProvider";
import ILocationNavigator from "../interfaces/ILocationNavigator";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {
    protected webAuth: WebAuth;
    private authConfig: IAuthConfig;

    constructor(@inject("IAuthConfig") authConfig: IAuthConfig,
        @inject("ISettingsManager") private settingsManager: ISettingsManager,
        @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {
        this.authConfig = assign({}, { scope: "openid" }, authConfig);
        this.initialize();
    }

    login(redirectUrl: string): void {
        this.webAuth.authorize({
            state: redirectUrl,
            redirectUri: this.authConfig.loginCallbackUrl,
            responseType: this.getResponseType()
        });
    }

    requestProfile(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let userProfile = this.getUserProfile();
            if (!userProfile) {
                reject();
            }
            resolve(userProfile);
        });
    }

    renewAuth(): Promise<void> {
        return this.requestSSOData()
            .then((authResult: Auth0DecodedHash) => {
                let currentUser = this.getUserProfile();
                if (!currentUser || currentUser.sub !== authResult.idTokenPayload.sub) {
                    this.saveUserProfile(authResult.idTokenPayload);
                }
                this.saveAuthData(authResult);
            });
    }

    requestSSOData(): Promise<Auth0DecodedHash> {
        return new Promise((resolve, reject) => {
            this.webAuth.renewAuth({ redirectUri: this.authConfig.renewCallbackUrl, usePostMessage: true },
                (error, authResult: Auth0DecodedHash) => {
                    if (error || !authResult.accessToken || !authResult.idToken || !authResult.idTokenPayload) {
                        return reject(error);
                    }
                    resolve(authResult);
                });
        });
    }


    parseHash(hash: string): Promise<Auth0DecodedHash> {
        return new Promise((resolve, reject) => {
            this.webAuth.parseHash(<ParseHashOptions>hash, (error, authResult) => {
                if (error) return reject(error);
                resolve(authResult);
            });
        });
    }

    logout(redirectUrl?: string): Promise<void> {
        let returnTo = this.authConfig.logoutCallbackUrl;
        if (redirectUrl) {
            returnTo += "?redirectUrl=" + redirectUrl;
        }
        this.settingsManager.setValue("auth_id_token", null);
        this.settingsManager.setValue("auth_access_token", null);
        this.settingsManager.setValue("auth_profile", null);
        let url = `https://${this.authConfig.clientNamespace}/v2/logout?returnTo=${encodeURI(returnTo)}&client_id=${this.authConfig.clientId}`;
        this.locationNavigator.navigate(url);
        return Promise.resolve();
    }

    getAccessToken(): string {
        return this.settingsManager.getValue<string>("auth_access_token");
    }

    getIDToken(): string {
        return this.settingsManager.getValue<string>("auth_id_token");
    }

    getUserId(): string {
        return this.getUserProfile()[this.authConfig.audience + "/app_metadata"].userId;
    }

    private initialize() {
        this.webAuth = new WebAuth({
            domain: this.authConfig.clientNamespace,
            clientID: this.authConfig.clientId,
            redirectUri: this.authConfig.loginCallbackUrl,
            scope: this.authConfig.scope,
            audience: this.authConfig.audience,
            responseType: this.getResponseType(),
            leeway: 30
        });
    }

    private saveAuthData(authResult: Auth0DecodedHash) {
        this.settingsManager.setValue("auth_id_token", authResult.idToken);
        this.settingsManager.setValue("auth_access_token", authResult.accessToken);
    }

    private getUserProfile(): any {
        return this.settingsManager.getValue("auth_profile");
    }

    private saveUserProfile(userProfile: any) {
        this.settingsManager.setValue("auth_profile", userProfile);
    }

    private getResponseType(): string {
        return "id_token token";
    }
}

export default Auth0Provider;
