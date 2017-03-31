import IAuthChecker from "../interfaces/IAuthChecker";
import IAuthProvider from "../interfaces/IAuthProvider";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import {injectable, inject} from "inversify";
import {Observable, Disposable} from "rx";

@injectable()
class AuthChecker implements IAuthChecker {

    private subscription: Disposable;

    constructor(@inject("IAuthProvider") private authProvider:IAuthProvider,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {

    }

    public check(interval?: number): void {
        let pollInterval = interval || 60;
        if (this.subscription) {
            this.subscription.dispose();
        }
        this.subscription = Observable.interval(pollInterval * 1000)
            .subscribe(() => {
                this.authProvider.renewAuth()
                    .catch((error) => {
                        this.subscription.dispose();
                        return this.authProvider.logout(this.locationNavigator.getCurrentLocation().href);
                    });
            });
    };
}

export default AuthChecker