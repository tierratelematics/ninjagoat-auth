import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {IHttpClient} from "ninjagoat";
import {ISettingsManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import {Observable, Disposable} from "rx";
import {Auth0DecodedHash} from "auth0-js";

export class AuthModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;
}

export interface IAuthConfig {
    clientId: string;
    clientNamespace: string;
    loginCallbackUrl: string;
    logoutCallbackUrl: string;
    renewCallbackUrl: string;
    audience: string;
    scope?: string;
}

export interface IAuthProvider {
    login(redirectUrl: string): void;
    renewAuth(): Promise<void>
    requestProfile(): Promise<any>;
    requestSSOData(): Promise<any>;
    parseHash(hash: string): Promise<any>;
    logout(redirectUrl?: string);
}

export interface IAuthDataRetriever {
    getAccessToken(): string;
    getIDToken(): string;
    getUserId(): string;
}

export interface ISessionChecker {
    check(interval?: number): Disposable;
}

export interface ILocationNavigator {
    navigate(url: string);
    getCurrentLocation(): Location;
}

export class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

    protected lock: any;

    constructor(authConfig: IAuthConfig, settingsManager: ISettingsManager, locationNavigator: ILocationNavigator);

    login(redirectUrl: string): void;

    renewAuth(): Promise<void>;

    requestProfile(): Promise<any>;

    requestSSOData(): Promise<Auth0DecodedHash>;

    parseHash(hash: string): Promise<Auth0DecodedHash>;

    logout(redirectUrl?: string): Promise<void>;

    getAccessToken(): string;

    getIDToken(): string;

    getUserId(): string;
}

export class SessionChecker implements ISessionChecker {
    check(interval?: number): Disposable;
}


export class AuthHttpClient implements IHttpClient {

    constructor(httpClient: IHttpClient, settingsManager: ISettingsManager);

    get(url: string, headers?: Dictionary<string>): Observable<HttpResponse>;

    post(url: string, body: any, headers?: Dictionary<string>): Observable<HttpResponse>;

    put(url: string, body: any, headers?: Dictionary<string>): Observable<HttpResponse>;

    delete(url: string, headers?: Dictionary<string>): Observable<HttpResponse>;

}

export class AuthRouteStrategy implements IRouteStrategy {

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string>;

}

export function Authorized();