interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    loginCallbackUrl:string;
    logoutCallbackUrl:string;
    loginRedirect:{
        area:string;
        viewmodelId?:string;
    },
    logoutRedirect:{
        area:string;
        viewmodelId?:string;
    }
}

export default IAuthConfig