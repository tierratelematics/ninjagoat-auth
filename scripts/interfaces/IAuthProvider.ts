import {Observable} from "rx";

interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    getProfile():Observable<any>;
    getAccessToken():string;
    getIDToken():string;
}

export default IAuthProvider