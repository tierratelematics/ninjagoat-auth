import * as Promise from "bluebird";

interface IAuthProvider {
    login(redirectUrl:string, connectionName?:string);
    callback(accessToken:string, idToken:string);
    requestProfile():Promise<any>;
    requestSSO():Promise<any>;
    logout();
    isLoggedIn():Promise<boolean>;
}

export default IAuthProvider