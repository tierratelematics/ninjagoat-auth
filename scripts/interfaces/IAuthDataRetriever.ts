interface IAuthDataRetriever {
    getAccessToken():string;
    getIDToken():string;
    getRefreshToken():string;
}

export default IAuthDataRetriever