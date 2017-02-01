interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    loginCallbackUrl:string;
    logoutCallbackUrl:string;
    connection:string;
    scope?:string;
}

export default IAuthConfig