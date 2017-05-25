import {Disposable} from "rx";

interface ISessionChecker {
    check(interval?:number):Disposable;
}

export default ISessionChecker