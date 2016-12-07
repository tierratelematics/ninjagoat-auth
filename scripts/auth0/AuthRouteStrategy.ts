import {IRouteStrategy} from "ninjagoat";
import {RegistryEntry} from "ninjagoat";
import {RouterState} from "react-router";
import * as Promise from "bluebird";
import {inject, injectable} from "inversify";
import IAuthProvider from "../interfaces/IAuthProvider";
import IAuthDataRetriever from "../interfaces/IAuthDataRetriever";
import ILocationNavigator from "../interfaces/ILocationNavigator";

@injectable()
class AuthRouteStrategy implements IRouteStrategy {

    constructor(@inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("IAuthProvider") private authDataRetriever: IAuthDataRetriever,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {

    }

    enter(entry: RegistryEntry<any>, nextState: RouterState): Promise<string> {
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (!needsAuthorization) return Promise.resolve("");
        return Promise.resolve(this.authDataRetriever.getIDToken())
            .then(idToken => idToken ? null : this.authProvider.requestSSOData())
            .then((data: any) => {
                if (!data) return "";
                return this.authProvider.login(this.locationNavigator.getCurrentLocation(), data.sso ? data.lastUsedConnection.name : null);
            });
    }

}

export default AuthRouteStrategy