import ISessionChecker from "../interfaces/ISessionChecker";
import IAuthProvider from "../interfaces/IAuthProvider";
import ILocationNavigator from "../interfaces/ILocationNavigator";
import IAuthErrorHandler from "../interfaces/IAuthErrorHandler";
import AuthStage from "../AuthStage";
import {injectable, inject} from "inversify";
import {Observable, Disposable} from "rx";
import {IUriResolver, RegistryEntry} from "ninjagoat";

@injectable()
class SessionChecker implements ISessionChecker {

    private subscription: Disposable;

    constructor(@inject("IAuthProvider") private authProvider:IAuthProvider,
                @inject("ILocationNavigator") private locationNavigator: ILocationNavigator,
                @inject("IUriResolver") private uriResolver: IUriResolver,
                @inject("IAuthErrorHandler") private authErrorHandler: IAuthErrorHandler) {

    }

    public check(interval?: number): Disposable {
        let pollInterval = interval || 60 * 1000;
        if (this.subscription) {
            this.subscription.dispose();
        }
        this.subscription = Observable.interval(pollInterval)
            .flatMap(() => !this.needsAuthorization() ? Observable.empty() : Observable.fromPromise(this.authProvider.renewAuth()))
            .subscribeOnError((error) => {
                this.subscription.dispose();
                this.authErrorHandler.handleError(AuthStage.RENEWAL, error);
            });
        return this.subscription;
    };

    private needsAuthorization(): boolean {
        let entry: RegistryEntry<any> = this.uriResolver.resolve(this.locationNavigator.getCurrentLocation().pathname).viewmodel;
        return <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
    }
}

export default SessionChecker