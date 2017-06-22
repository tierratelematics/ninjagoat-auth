import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import IAuthProvider from "./interfaces/IAuthProvider";
import Auth0Provider from "./auth0/Auth0Provider";
import ISessionChecker from "./interfaces/ISessionChecker";
import SessionChecker from "./auth0/SessionChecker";
import {IHttpClient} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import AuthHttpClient from "./auth0/AuthHttpClient";
import IAuthDataRetriever from "./interfaces/IAuthDataRetriever";
import ILocationNavigator from "./interfaces/ILocationNavigator";
import IAuthErrorHandler from "./interfaces/IAuthErrorHandler";
import LocationNavigator from "./LocationNavigator";
import {IRouteStrategy} from "ninjagoat";
import AuthRouteStrategy from "./auth0/AuthRouteStrategy";
import AuthErrorHandler from "./auth0/AuthErrorHandler";
import {Observable} from "rx";

class AuthModule implements IModule {

    modules = (container:interfaces.Container) => {
        container.bind<IAuthProvider>("IAuthProvider").to(Auth0Provider).inSingletonScope();
        container.bind<IAuthDataRetriever>("IAuthDataRetriever").to(Auth0Provider).inSingletonScope();
        container.bind<IAuthErrorHandler>("IAuthErrorHandler").to(AuthErrorHandler).inSingletonScope();
        container.bind<ILocationNavigator>("ILocationNavigator").to(LocationNavigator).inSingletonScope();
        container.unbind("IHttpClient");
        container.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope().whenInjectedInto(AuthHttpClient);
        container.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
        container.unbind("IRouteStrategy");
        container.bind<IRouteStrategy>("IRouteStrategy").to(AuthRouteStrategy).inSingletonScope();
        container.bind<ISessionChecker>("ISessionChecker").to(SessionChecker).inSingletonScope();
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {
    }
}

export default AuthModule;
