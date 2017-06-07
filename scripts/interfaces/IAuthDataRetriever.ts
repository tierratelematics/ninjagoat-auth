interface IAuthDataRetriever {
    getAccessToken():string;
    getIDToken():string;
    getUserId(): string;
}

export default IAuthDataRetriever
