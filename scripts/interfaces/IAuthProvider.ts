interface IAuthProvider {
    login(username:string, password:string);
    logout();
    isLoggedIn():boolean;
}

export default IAuthProvider