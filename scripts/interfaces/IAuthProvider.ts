import * as Promise from "bluebird";

interface IAuthProvider {
    login(username:string, password:string):Promise<void>;
    signup(username:string, password:string):Promise<void>;
    logout():Promise<void>;
    isLoggedIn():boolean;
}

export default IAuthProvider