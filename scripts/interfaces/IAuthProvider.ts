import * as Promise from "bluebird";

interface IAuthProvider {
    login(username:string, password:string, scope?:string):Promise<any>;
    signup(username:string, password:string):Promise<void>;
    changePassword(username:string):Promise<void>;
    requestProfile():Promise<any>;
    logout():Promise<void>;
    isLoggedIn():boolean;
}

export default IAuthProvider