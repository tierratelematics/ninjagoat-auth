interface IAuthDataRetriever {
    getAccessToken():string;
    getIDToken():string;
    getProfile():any;
}

export default IAuthDataRetriever