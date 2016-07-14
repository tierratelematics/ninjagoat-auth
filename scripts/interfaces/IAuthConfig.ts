interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    clientCallbackUrl:string;
    redirectTo:{
        area:string;
        viewmodelId?:string;
    }
}

export default IAuthConfig