import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import IAuthProvider from "./interfaces/IAuthProvider";
import Auth0Provider from "./auth0/Auth0Provider";
import LoginViewModel from "./auth0/LoginViewModel";
import {IHttpClient} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import AuthHttpClient from "./auth0/AuthHttpClient";
import IAuthDataRetriever from "./interfaces/IAuthDataRetriever";
import LogoutViewModel from "./auth0/LogoutViewModel";
import ILocationNavigator from "./interfaces/ILocationNavigator";
import LocationNavigator from "./LocationNavigator";
import {IRouteStrategy} from "ninjagoat";
import AuthRouteStrategy from "./auth0/AuthRouteStrategy";
import {Observable} from "rx";

class AuthModule implements IModule {

    modules = (kernel:interfaces.Kernel) => {
        kernel.bind<IAuthProvider>("IAuthProvider").to(Auth0Provider).inSingletonScope();
        kernel.bind<IAuthDataRetriever>("IAuthDataRetriever").to(Auth0Provider).inSingletonScope();
        kernel.bind<ILocationNavigator>("ILocationNavigator").to(LocationNavigator).inSingletonScope();
        kernel.unbind("IHttpClient");
        kernel.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope().whenInjectedInto(AuthHttpClient);
        kernel.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
        kernel.unbind("IRouteStrategy");
        kernel.bind<IRouteStrategy>("IRouteStrategy").to(AuthRouteStrategy).inSingletonScope();
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {
        registry
            .add(LoginViewModel, context => Observable.empty<void>())
            .add(LogoutViewModel, context => Observable.empty<void>())
            .forArea("Auth");
    }
}

export default AuthModule;
