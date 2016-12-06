interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    loginCallbackUrl:string;
    logoutCallbackUrl:string;
    loginRedirect:{
        area:string;
        viewmodelId?:string;
    };
    notAuthorizedRedirect:{
        area:string;
        viewmodelId?:string;
    };
    connection:string;
}

export default IAuthConfig