import * as Promise from "bluebird";

interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    requestProfile():Promise<any>;
    logout();
    isLoggedIn():boolean;
}

export default IAuthProvider