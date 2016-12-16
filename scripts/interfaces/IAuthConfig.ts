interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    loginCallbackUrl:string;
    logoutCallbackUrl:string;
    scope?:string;
}

export default IAuthConfig