import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import {inject, injectable} from "inversify";
import IAuthProvider from "../interfaces/IAuthProvider";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import IAuthConfig from "../interfaces/IAuthConfig";
import IAuthErrorHandler from "../interfaces/IAuthErrorHandler";
import AuthStage from "../AuthStage";
import {Auth0DecodedHash, Auth0Error} from "auth0-js";
import * as qs from "qs";

@injectable()
class AuthRouteStrategy implements IRouteStrategy {

    private isAuthenticated: boolean = false;

    constructor(@inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("IAuthProvider") private authDataRetriever: IAuthDataRetriever,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator,
                @inject("IAuthConfig") private config: IAuthConfig,
                @inject("IAuthErrorHandler") private authErrorHandler: IAuthErrorHandler) {

    }

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string> {
        let currentLocation = this.locationNavigator.getCurrentLocation();
        if (entry.id === "Index" && currentLocation.pathname !== "/") {
            return Promise.resolve("");
        }
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (!needsAuthorization) return Promise.resolve("");
        if ((currentLocation.origin.concat(currentLocation.pathname)) === (this.config.loginCallbackUrl) && currentLocation.hash !== "") {
            if (currentLocation.hash.startsWith("#error")) {
                let errorMessage = qs.parse(currentLocation.hash.replace("#", ""));
                return Promise.resolve(
                    this.authErrorHandler.handleError(AuthStage.LOGIN, <Auth0Error>{
                        error: errorMessage.error,
                        errorDescription: errorMessage.error_description})
                    ).then(() => "");
            }
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
                    return Promise.resolve(this.authErrorHandler.handleError(AuthStage.LOGIN, error)).then(() => "");
                });
        } else {
            this.authProvider.requestSSOData()
                .then((authResult: Auth0DecodedHash) => "")
                .catch((error) => this.authErrorHandler.handleError(AuthStage.RENEWAL, error));
            return Promise.resolve("");
        }
    }

}

export default AuthRouteStrategy