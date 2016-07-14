import {IModule} from "ninjagoat";
import {IKernel, IKernelModule} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";

class AuthModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {

    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default AuthModule;
