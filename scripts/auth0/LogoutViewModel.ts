import {IViewModel} from "ninjagoat";
import {Subject, IDisposable, IObserver} from "rx";
import {inject} from "inversify";
import {ViewModel} from "ninjagoat";
import IAuthConfig from "../interfaces/IAuthConfig";
import {INavigationManager} from "ninjagoat";
import {ISettingsManager} from "ninjagoat";

@ViewModel("Logout")
class LogoutViewModel implements IViewModel<any> {
    "force nominal type for IViewModel":any;

    private subject = new Subject<void>();
    private subscription:IDisposable;

    constructor(@inject("ISettingsManager") private settingsManager:ISettingsManager,
                @inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("INavigationManager") private navigationManager:INavigationManager) {
        this.settingsManager.setValue("auth_id_token", null);
        this.settingsManager.setValue("auth_access_token", null);
        this.settingsManager.setValue("auth_profile", null);
        this.navigationManager.navigate(authConfig.logoutRedirect.area, authConfig.logoutRedirect.viewmodelId);
    }

    subscribe(observer:IObserver<void>):IDisposable
    subscribe(onNext?:(value:void) => void, onError?:(exception:any) => void, onCompleted?:() => void):IDisposable
    subscribe(observerOrOnNext?:(IObserver<void>) | ((value:void) => void), onError?:(exception:any) => void, onCompleted?:() => void):IDisposable {
        if (isObserver(observerOrOnNext))
            return this.subject.subscribe(observerOrOnNext);
        else
            return this.subject.subscribe(observerOrOnNext, onError, onCompleted);
    }


    dispose():void {
        if (this.subscription) this.subscription.dispose();
        this.subject.onCompleted();
    }
}

function isObserver<T>(observerOrOnNext:(IObserver<T>) | ((value:T) => void)):observerOrOnNext is IObserver<T> {
    return (<IObserver<T>>observerOrOnNext).onNext !== undefined;
}

export default LogoutViewModel