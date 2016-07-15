import {Observable} from "rx";

interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    logout():Observable<void>;
    isLoggedIn():boolean;
}

export default IAuthProvider