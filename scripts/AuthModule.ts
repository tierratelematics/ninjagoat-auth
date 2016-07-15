import {IModule} from "ninjagoat";
import {IKernel, IKernelModule} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import IAuthProvider from "./interfaces/IAuthProvider";
import Auth0Provider from "./auth0/Auth0Provider";
import IHashRetriever from "./interfaces/IHashRetriever";
import HashRetriever from "./HashRetriever";
import AuthViewModel from "./auth0/AuthViewModel";
import {IHttpClient} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import AuthHttpClient from "./auth0/AuthHttpClient";

class AuthModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        kernel.bind<IAuthProvider>("IAuthProvider").to(Auth0Provider).inSingletonScope();
        kernel.bind<IHashRetriever>("IHashRetriever").to(HashRetriever).inSingletonScope();
        kernel.unbind("IHttpClient");
        kernel.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope().whenInjectedInto(AuthHttpClient);
        kernel.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {
        registry.add(AuthViewModel).forArea("Auth");
    }
}

export default AuthModule;
