interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    logoutCallbackUrl:string;
    notAuthorizedRedirect:{
        area:string;
        viewmodelId?:string;
    },
    connection:string;
}

export default IAuthConfig