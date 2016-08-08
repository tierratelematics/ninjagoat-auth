import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import IAuthProvider from "./interfaces/IAuthProvider";
import Auth0Provider from "./auth0/Auth0Provider";
import {IHttpClient} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import AuthHttpClient from "./auth0/AuthHttpClient";
import IAuthDataRetriever from "./interfaces/IAuthDataRetriever";
import LogoutViewModel from "./auth0/LogoutViewModel";
import ILocationNavigator from "./interfaces/ILocationNavigator";
import LocationNavigator from "./LocationNavigator";
import {IRoutingAdapter} from "ninjagoat";
import AuthorizedRoutingAdapter from "./auth0/AuthorizedRoutingAdapter";

class AuthModule implements IModule {

    modules = (kernel:interfaces.Kernel) => {
        kernel.bind<IAuthProvider>("IAuthProvider").to(Auth0Provider).inSingletonScope();
        kernel.bind<IAuthDataRetriever>("IAuthDataRetriever").to(Auth0Provider).inSingletonScope();
        kernel.bind<ILocationNavigator>("ILocationNavigator").to(LocationNavigator).inSingletonScope();
        kernel.unbind("IHttpClient");
        kernel.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope().whenInjectedInto(AuthHttpClient);
        kernel.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
        kernel.unbind("IRoutingAdapter");
        kernel.bind<IRoutingAdapter>("IRoutingAdapter").to(AuthorizedRoutingAdapter).inSingletonScope();
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {
        registry.add(LogoutViewModel).forArea("Auth");
    }
}

export default AuthModule;
