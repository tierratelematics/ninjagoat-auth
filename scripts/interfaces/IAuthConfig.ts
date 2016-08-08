interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    logoutCallbackUrl:string;
    notAuthorizedRedirect:{
        area:string;
        viewmodelId?:string;
    }
}

export default IAuthConfig