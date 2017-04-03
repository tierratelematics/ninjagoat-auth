import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import {inject, injectable} from "inversify";
import IAuthProvider from "../interfaces/IAuthProvider";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import IAuthConfig from "../interfaces/IAuthConfig";
import {Auth0DecodedHash} from "auth0-js";

@injectable()
class AuthRouteStrategy implements IRouteStrategy {

    private isAuthenticated: boolean = false;

    constructor(@inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("IAuthProvider") private authDataRetriever: IAuthDataRetriever,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator,
                @inject("IAuthConfig") private config: IAuthConfig) {

    }

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string> {
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (!needsAuthorization) return Promise.resolve("");
        let currentLocation = this.locationNavigator.getCurrentLocation();
        if ((currentLocation.origin.concat(currentLocation.pathname)) === (this.config.loginCallbackUrl) && currentLocation.hash !== "") {
            return this.authProvider.parseHash(currentLocation.hash)
                .then((authResult: Auth0DecodedHash) =>
                    authResult.state ? decodeURIComponent(authResult.state).replace(currentLocation.origin, "") : currentLocation.pathname
                );
        }
        if (!this.isAuthenticated) {
            return Promise.resolve(this.authProvider.renewAuth())
                .then(() => {
                    this.isAuthenticated = true;
                    return ""; })
                .catch((error) => {
                    this.isAuthenticated = false;
                    return this.authProvider.login(this.locationNavigator.getCurrentLocation().href);
                });
        } else {
            this.authProvider.requestSSOData()
                .then((authResult: Auth0DecodedHash) => "")
                .catch((error) => this.authProvider.login(this.locationNavigator.getCurrentLocation().href));
            return Promise.resolve("");
        }
    }

}

export default AuthRouteStrategy