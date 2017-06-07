interface IAuthProvider {
    login(redirectUrl: string): void;
    renewAuth(): Promise<void>;
    requestProfile(): Promise<any>;
    requestSSOData(): Promise<any>;
    parseHash(hash: string): Promise<any>;
    logout(redirectUrl?: string): Promise<void>;
}

export default IAuthProvider
