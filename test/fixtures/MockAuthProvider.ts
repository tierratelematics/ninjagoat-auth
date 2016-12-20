import IAuthProvider from "../../scripts/interfaces/IAuthProvider";
import IAuthDataRetriever from "../../scripts/interfaces/IAuthDataRetriever";
import * as Promise from "bluebird";

export default class MockAuthProvider implements IAuthProvider, IAuthDataRetriever {
    getAccessToken(): string {
        return undefined;
    }

    getIDToken(): string {
        return undefined;
    }

    getRefreshToken(): string {
        return undefined;
    }

    login(redirectUrl: string, connectionName?: string) {
    }

    requestProfile(): Promise<any> {
        return undefined;
    }

    requestSSOData(): Promise<any> {
        return undefined;
    }

    logout() {
    }

}