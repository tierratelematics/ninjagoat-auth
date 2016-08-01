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
        loginCallbackUrl:string;
        logoutCallbackUrl:string;
        loginRedirect:{
            area:string;
            viewmodelId?:string;
        },
        logoutRedirect:{
            area:string;
            viewmodelId?:string;
        }
    }

    export interface IAuthProvider {
        login(username:string, password:string):Promise<void>;
        signup(username:string, password:string):Promise<void>;
        changePassword(username:string):Promise<void>;
        logout():Promise<void>;
        isLoggedIn():boolean;
    }

    export interface IAuthDataRetriever {
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
}

export = NinjagoatAuth;