import {Observable} from "rx";

interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    getProfile(idToken:string):Observable<any>;
    getAccessToken():string;
    getIDToken():string;
}

export default IAuthProvider