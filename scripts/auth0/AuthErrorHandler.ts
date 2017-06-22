import AuthStage from "../AuthStage";
import IAuthErrorHandler from "../interfaces/IAuthErrorHandler";
import IAuthProvider from "../interfaces/IAuthProvider";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import {injectable, inject} from "inversify";
import {Auth0Error} from "auth0-js";

@injectable()
class AuthErrorHandler implements IAuthErrorHandler {

    constructor(@inject("IAuthProvider") private authProvider: IAuthProvider,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {

    }

    public handleError(stage: AuthStage, error: Auth0Error): Promise<void> {
        let currentLocation = this.locationNavigator.getCurrentLocation();
        let redirectUri = currentLocation.href;
        if (currentLocation.hash.startsWith("#error")) {
            redirectUri = redirectUri.substring(0, redirectUri.lastIndexOf("#"));
        }
        if (stage === AuthStage.LOGIN) {
            this.authProvider.login(redirectUri);
        } else if (stage === AuthStage.RENEWAL) {
            this.authProvider.logout(redirectUri);
        }
        return Promise.resolve();
    }
}

export default AuthErrorHandler