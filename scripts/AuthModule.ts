import {IModule} from "ninjagoat";
import {IKernel, IKernelModule} from "inversify";

class AuthModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default AuthModule;
