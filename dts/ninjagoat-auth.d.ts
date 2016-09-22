/// <reference path="../typings/index.d.ts" />

import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {IHttpClient} from "ninjagoat";
import {ISettingsManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import * as Promise from "bluebird";

declare module NinjagoatAuth {

    export class AuthModule implements IModule {

        modules:(kernel:interfaces.Kernel) => void;

        register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void;
    }

    export interface IAuthConfig {
        clientId:string;
        clientNamespace:string;
        logoutCallbackUrl:string;
        notAuthorizedRedirect:{
            area:string;
            viewmodelId?:string;
        },
        connection:string;
    }

    export interface IAuthProvider {
        login(username:string, password:string, scope?:string):Promise<any>;
        signup(username:string, password:string):Promise<void>;
        changePassword(username:string):Promise<void>;
        requestProfile():Promise<any>;
        logout():Promise<void>;
        isLoggedIn():boolean;
    }

    export interface IAuthDataRetriever {
        getAccessToken():string;
        getIDToken():string;
    }

    export interface ILocationNavigator {
        navigate(url:string);
    }

    export class Auth0Provider implements IAuthProvider, IAuthDataRetriever {

        auth: any;

        constructor(authConfig:IAuthConfig, settingsManager:ISettingsManager, locationNavigator:ILocationNavigator);

        login(username:string, password:string, scope?:string):Promise<void>;

        signup(username:string, password:string):Promise<void>;

        changePassword(username:string):Promise<void>;

        requestProfile():Promise<any>;

        logout():Promise<void>;

        isLoggedIn():boolean;

        getAccessToken():string;

        getIDToken():string;

    }

    export class AuthHttpClient implements IHttpClient {

        constructor(httpClient:IHttpClient, settingsManager:ISettingsManager);

        get(url:string, headers?:Dictionary<string>):Rx.Observable<HttpResponse>;

        post(url:string, body:any, headers?:Dictionary<string>):Rx.Observable<HttpResponse>;

        put(url:string, body:any, headers?:Dictionary<string>):Rx.Observable<HttpResponse>;

        delete(url:string, headers?:Dictionary<string>):Rx.Observable<HttpResponse>;

    }

    export function Authorized();
}

export = NinjagoatAuth;