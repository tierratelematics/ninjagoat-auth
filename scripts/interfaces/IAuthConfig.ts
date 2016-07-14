interface IAuthConfig {
    clientId:string;
    clientNamespace:string;
    redirectTo:{
        area:string;
        viewmodelId?:string;
    }
}

export default IAuthConfig