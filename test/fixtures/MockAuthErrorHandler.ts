import { Auth0Error } from "auth0-js";
import { injectable } from "inversify";

import AuthStage from "../../scripts/AuthStage";
import IAuthErrorHandler from "../../scripts/interfaces/IAuthErrorHandler";

@injectable()
class MockAuthErrorHandler implements IAuthErrorHandler {

    public handleError(stage: AuthStage, error: Auth0Error): Promise<void> {
        return Promise.resolve();
    }
}

export default MockAuthErrorHandler;
