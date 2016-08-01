interface IAuthDataRetriever {
    getAccessToken():string;
    getIDToken():string;
}

export default IAuthDataRetriever