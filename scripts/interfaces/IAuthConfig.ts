interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    loginCallbackUrl:string;
    logoutCallbackUrl:string;
    renewCallbackUrl:string;
    audience:string;
    scope?:string;
}

export default IAuthConfig