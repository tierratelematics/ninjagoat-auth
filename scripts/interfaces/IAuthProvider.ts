import * as Promise from "bluebird";

interface IAuthProvider {
    login(redirectUrl:string, connectionName?:string);
    requestProfile():Promise<any>;
    requestSSOData():Promise<any>;
    logout();
}

export default IAuthProvider