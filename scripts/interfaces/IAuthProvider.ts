interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    isLoggedIn():boolean;
}

export default IAuthProvider