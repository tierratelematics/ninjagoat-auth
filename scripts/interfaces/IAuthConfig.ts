interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    logoutCallbackUrl:string;
    logoutRedirect:{
        area:string;
        viewmodelId?:string;
    }
}

export default IAuthConfig