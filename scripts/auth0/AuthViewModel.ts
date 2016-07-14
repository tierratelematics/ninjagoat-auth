import {IViewModel} from "ninjagoat";
import {Subject, IDisposable, IObserver} from "rx";
import IHashRetriever from "../interfaces/IHashRetriever";
import IAuthProvider from "../interfaces/IAuthProvider";
import {inject} from "inversify";
import {ViewModel} from "ninjagoat";
import IAuthConfig from "../interfaces/IAuthConfig";
import {INavigationManager} from "ninjagoat";

@ViewModel("AuthIndex")
class AuthViewModel implements IViewModel<any> {
    "force nominal type for IViewModel":any;

    private subject = new Subject<void>();
    private subscription:IDisposable;

    constructor(@inject("IHashRetriever") private hashRetriever:IHashRetriever,
                @inject("IAuthProvider") private authProvider:IAuthProvider,
                @inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("INavigationManager") private navigationManager:INavigationManager) {
        this.saveCredentials();
        this.navigationManager.navigate(authConfig.redirectTo.area, authConfig.redirectTo.viewmodelId);
    }

    private saveCredentials() {
        let hash = this.hashRetriever.retrieveHash();
        this.authProvider.callback(this.getHashValue(hash, 'access_token'), this.getHashValue(hash, 'id_token'));
    }

    private getHashValue(hash:string, key:string):string {
        let matches = hash.match(new RegExp(key + '=([^&]*)'));
        return matches ? matches[1] : null;
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

export default AuthViewModel