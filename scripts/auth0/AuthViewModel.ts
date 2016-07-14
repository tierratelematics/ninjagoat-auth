import {IViewModel} from "ninjagoat";
import {Subject, IDisposable, IObserver} from "rx";
import IHashRetriever from "../interfaces/IHashRetriever";
import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import {ViewModel} from "ninjagoat";

@ViewModel("AuthIndex")
class AuthViewModel implements IViewModel<any> {
    "force nominal type for IViewModel":any;

    private subject = new Subject<void>();
    private subscription:IDisposable;

    constructor(@inject("IHashRetriever") private hashRetriever:IHashRetriever,
                @inject("IAuthProvider") private authProvider:IAuthProvider) {

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