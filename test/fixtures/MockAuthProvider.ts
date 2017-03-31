import IAuthProvider from "../../scripts/interfaces/IAuthProvider";
import IAuthDataRetriever from "../../scripts/interfaces/IAuthDataRetriever";

export default class MockAuthProvider implements IAuthProvider, IAuthDataRetriever {
    getAccessToken(): string {
        return undefined;
    }

    getIDToken(): string {
        return undefined;
    }

    login(redirectUrl: string) {
    }

    renewAuth(): Promise<void> {
        return undefined;
    };

    requestProfile(): Promise<any> {
        return undefined;
    }

    requestSSOData(): Promise<any> {
        return undefined;
    }

    logout(redirectUrl?: string): Promise<void> {
        return undefined;
    }

}