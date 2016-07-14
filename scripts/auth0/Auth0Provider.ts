import IAuthProvider from "../interfaces/IAuthProvider";
import {injectable, inject} from "inversify";
import {Observable} from "rx";

@injectable()
class Auth0Provider implements IAuthProvider {

    constructor() {

    }

    login() {
    }

    callback(accessToken:string, idToken:string) {
    }

    getProfile(idToken:string):Observable<any> {
        return undefined;
    }

    getAccessToken():string {
        return undefined;
    }

    getIDToken():string {
        return undefined;
    }

}

export default Auth0Provider