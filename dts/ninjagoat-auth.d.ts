/// <reference path="../typings/index.d.ts" />

import {IModule} from "ninjagoat";
import {IKernelModule} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {Observable, IObserver, IDisposable} from "rx";
import {IHttpClient} from "ninjagoat";
import {ISettingsManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";
import {HttpResponse} from "ninjagoat";
import {IViewModel} from "ninjagoat";
import {INavigationManager} from "ninjagoat";


declare module NinjagoatAuth {

    export class AuthModule implements IModule {

        modules:IKernelModule;

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

    interface IAuthProvider {
        login();
        callback(accessToken:string, idToken:string);
        logout();
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

    export interface IHashRetriever {
        retrieveHash():string;
    }
}

export = NinjagoatAuth;