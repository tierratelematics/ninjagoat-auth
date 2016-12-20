import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {IHttpClient} from "ninjagoat";
import {ISettingsManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import * as Promise from "bluebird";
import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";

export class AuthModule implements IModule {

    modules: (kernel: interfaces.Kernel) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;
}

export interface IAuthConfig {
    clientId: string;
    clientNamespace: string;
    loginCallbackUrl: string;
    logoutCallbackUrl: string;
    scope?: string;
}

export interface IAuthProvider {
    login(redirectUrl: string, connectionName?: string);
    requestProfile(): Promise<any>;
    requestSSOData(): Promise<any>;
    logout();
}

export interface IAuthDataRetriever {
    getAccessToken(): string;
    getIDToken(): string;
    getRefreshToken(): string;
}

export interface ILocationNavigator {
    navigate(url: string);
}

export class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    protected lock: any;

    constructor(authConfig: IAuthConfig, settingsManager: ISettingsManager, locationNavigator: ILocationNavigator);

    login(redirectUrl: string, connectionName?: string);

    requestProfile(): Promise<any>;

    requestSSOData(): Promise<any>;

    logout(): Promise<void>;

    getAccessToken(): string;

    getIDToken(): string;

    getRefreshToken(): string;
}


export class AuthHttpClient implements IHttpClient {

    constructor(httpClient: IHttpClient, settingsManager: ISettingsManager);

    get(url: string, headers?: Dictionary<string>): Rx.Observable<HttpResponse>;

    post(url: string, body: any, headers?: Dictionary<string>): Rx.Observable<HttpResponse>;

    put(url: string, body: any, headers?: Dictionary<string>): Rx.Observable<HttpResponse>;

    delete(url: string, headers?: Dictionary<string>): Rx.Observable<HttpResponse>;

}

export class AuthRouteStrategy implements IRouteStrategy {

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string>;

}

export function Authorized();