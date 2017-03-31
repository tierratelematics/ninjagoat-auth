import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import {inject, injectable} from "inversify";
import IAuthProvider from "../interfaces/IAuthProvider";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import IAuthConfig from "../interfaces/IAuthConfig";

@injectable()
class AuthRouteStrategy implements IRouteStrategy {

    constructor(@inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("IAuthProvider") private authDataRetriever: IAuthDataRetriever,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator,
                @inject("IAuthConfig") private config: IAuthConfig) {

    }

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string> {
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (!needsAuthorization) return Promise.resolve("");
        let currentLocation = this.locationNavigator.getCurrentLocation();
        if ((currentLocation.origin + currentLocation.pathname) === (this.config.loginCallbackUrl) && location.hash !== "") {
            return Promise.resolve(currentLocation.pathname);
        }
        return Promise.resolve(this.authProvider.renewAuth())
            .then(() => "")
            .catch((error) => {
                return this.authProvider.login(this.locationNavigator.getCurrentLocation().href);
            });
    }

}

export default AuthRouteStrategy