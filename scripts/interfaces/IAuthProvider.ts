import * as Promise from "bluebird";

interface IAuthProvider {
    login(redirectUrl:string, connectionName?:string);
    callback(accessToken:string, idToken:string);
    requestProfile():Promise<any>;
    requestSSOData():Promise<any>;
    logout();
}

export default IAuthProvider