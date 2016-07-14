import {Observable} from "rx";

interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    isLoggedIn():boolean;
    getProfile():Observable<any>;
    getAccessToken():string;
    getIDToken():string;
}

export default IAuthProvider