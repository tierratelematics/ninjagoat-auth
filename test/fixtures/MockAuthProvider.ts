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

    parseHash(hash: string): Promise<any> {
        return new Promise((resolve, reject) => {
            hash.split("&").forEach((part) => {
                if (part.indexOf("state") !== -1) {
                    resolve({state: part.replace("state=", "")});
                }
            });
            resolve({});
        });
    }

    requestSSOData(): Promise<any> {
        return undefined;
    }

    logout(redirectUrl?: string): Promise<void> {
        return undefined;
    }

}