import {IModule} from "ninjagoat";
import {IKernel, IKernelModule} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import IAuthProvider from "./interfaces/IAuthProvider";
import Auth0Provider from "./auth0/Auth0Provider";
import IHashRetriever from "./interfaces/IHashRetriever";
import HashRetriever from "./HashRetriever";
import LoginViewModel from "./auth0/LoginViewModel";
import {IHttpClient} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import AuthHttpClient from "./auth0/AuthHttpClient";
import IAuthDataRetriever from "./interfaces/IAuthDataRetriever";

class AuthModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        kernel.bind<IAuthProvider>("IAuthProvider").to(Auth0Provider).inSingletonScope();
        kernel.bind<IAuthDataRetriever>("IAuthDataRetriever").to(Auth0Provider).inSingletonScope();
        kernel.bind<IHashRetriever>("IHashRetriever").to(HashRetriever).inSingletonScope();
        kernel.unbind("IHttpClient");
        kernel.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope().whenInjectedInto(AuthHttpClient);
        kernel.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {
        registry.add(LoginViewModel).forArea("Auth");
    }
}

export default AuthModule;
