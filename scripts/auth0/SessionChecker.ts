import ISessionChecker from "../interfaces/ISessionChecker";
import IAuthProvider from "../interfaces/IAuthProvider";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import {injectable, inject} from "inversify";
import {Observable, Disposable} from "rx";

@injectable()
class SessionChecker implements ISessionChecker {

    private subscription: Disposable;

    constructor(@inject("IAuthProvider") private authProvider:IAuthProvider,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator) {

    }

    public check(interval?: number): void {
        let pollInterval = interval || 60 * 1000;
        if (this.subscription) {
            this.subscription.dispose();
        }
        this.subscription = Observable.interval(pollInterval)
            .flatMap(() => Observable.fromPromise(this.authProvider.renewAuth()))
            .subscribeOnError((error) => {
                this.subscription.dispose();
                this.authProvider.logout(this.locationNavigator.getCurrentLocation().href);
            });
    };
}

export default SessionChecker