interface IAuthProvider {
    login();
    callback(accessToken:string, idToken:string);
    logout();
    isLoggedIn():boolean;
}

export default IAuthProvider