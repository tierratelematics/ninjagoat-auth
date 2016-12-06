import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import * as Promise from "bluebird";
import {INavigationManager} from "ninjagoat";
import {inject, injectable} from "inversify";
import IAuthProvider from "../interfaces/IAuthProvider";
import IAuthConfig from "../interfaces/IAuthConfig";

@injectable()
class AuthRouteStrategy implements IRouteStrategy {

    constructor(@inject("INavigationManager") private navigationManager: INavigationManager,
                @inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("IAuthConfig") private authConfig: IAuthConfig) {

    }

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string> {
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (!needsAuthorization) return Promise.resolve("");
        return this.authProvider.isLoggedIn()
            .then(loggedIn => {
                if (!loggedIn)
                    return this.navigationManager.getNavigationPath(this.authConfig.notAuthorizedRedirect.area, this.authConfig.notAuthorizedRedirect.viewmodelId);
                return "";
            });
    }

}

export default AuthRouteStrategy