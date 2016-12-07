import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import IAuthConfig from "../interfaces/IAuthConfig";
//Needed cause auth0 and doesn't work since document is not found
const Auth0Lock = typeof document === "undefined" ? null : require("auth0-lock").default;
const Auth0 = typeof document === "undefined" ? null : require("auth0-js");
import {ISettingsManager} from "ninjagoat";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import * as Promise from "bluebird";

@injectable()
class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    protected lock: any;
    protected auth: any;

    constructor(@inject("IAuthConfig") private authConfig: IAuthConfig,
                @inject("ISettingsManager") private settingsManager: ISettingsManager,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {
        if (Auth0Lock) this.initialize();
    }

    private initialize() {
        this.auth = new Auth0({
            domain: this.authConfig.clientNamespace,
            clientID: this.authConfig.clientId,
            callbackOnLocationHash: true,
            callbackURL: this.authConfig.loginCallbackUrl
        });

        this.lock = new Auth0Lock(this.authConfig.clientId, this.authConfig.clientNamespace, {
            auth: {
                redirectUrl: this.authConfig.loginCallbackUrl,
                authParams: {
                    scope: 'openid'
                }
            }
        });
        this.lock.on("authenticated", authResult => {
            this.settingsManager.setValue("auth_id_token", authResult.idToken);
            this.settingsManager.setValue("auth_access_token", authResult.accessToken);
            this.settingsManager.setValue("auth_refresh_token", authResult.refreshToken);
            this.locationNavigator.navigate(authResult.state);
        });
    }

    login(redirectUrl: string, connectionName?: string) {
        //If I have a connectionName it means there's a SSO active
        if (!connectionName) {
            this.locationNavigator.navigate(`https://${this.authConfig.clientNamespace}/authorize?response_type=token` +
                `&scope=openid` +
                `&client_id=${this.authConfig.clientId}` +
                `&redirect_uri=${this.authConfig.loginCallbackUrl}` +
                `&state=${redirectUrl}`);
        } else {
            this.auth.signin({
                connection: connectionName,
                scope: 'openid',
                state: redirectUrl
            });
        }
    }

    requestProfile(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.lock.getProfile(this.getIDToken(), (error, profile) => {
                if (error) return reject(error);
                resolve(profile);
            });
        });
    }

    requestSSOData(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.auth.getSSOData((error, data) => {
                if (error) return reject(error);
                resolve(data);
            });
        });
    }

    logout(): Promise<void> {
        this.settingsManager.setValue("auth_id_token", null);
        this.settingsManager.setValue("auth_access_token", null);
        this.settingsManager.setValue("auth_refresh_token", null);
        this.settingsManager.setValue("auth_profile", null);
        let url = `https://${this.authConfig.clientNamespace}/v2/logout?returnTo=${this.authConfig.logoutCallbackUrl}&client_id=${this.authConfig.clientId}`;
        this.locationNavigator.navigate(url);
        return Promise.resolve();
    }

    getAccessToken(): string {
        return this.settingsManager.getValue<string>("auth_access_token");
    }

    getIDToken(): string {
        return this.settingsManager.getValue<string>("auth_id_token");
    }

    getRefreshToken(): string {
        return this.settingsManager.getValue<string>("auth_refresh_token");
    }

}

export default Auth0Provider