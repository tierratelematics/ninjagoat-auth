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
        clientCallbackUrl:string;
        redirectTo:{
            area:string;
            viewmodelId?:string;
        }
    }

    export interface IAuthProvider {
        login();
        callback(accessToken:string, idToken:string);
        isLoggedIn():boolean;
        getProfile():Observable<any>;
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

    export class AuthViewModel implements IViewModel<any> {
        "force nominal type for IViewModel":any;

        constructor(hashRetriever:IHashRetriever, authProvider:IAuthProvider, authConfig:IAuthConfig, navigationManager:INavigationManager);

        subscribe(observer:IObserver<void>):IDisposable
        subscribe(onNext?:(value:void) => void, onError?:(exception:any) => void, onCompleted?:() => void):IDisposable
        subscribe(observerOrOnNext?:(IObserver<void>) | ((value:void) => void), onError?:(exception:any) => void, onCompleted?:() => void):IDisposable;


        dispose():void;
    }
}

export = NinjagoatAuth;