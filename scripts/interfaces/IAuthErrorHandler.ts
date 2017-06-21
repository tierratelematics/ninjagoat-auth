import AuthStage from "../AuthStage";

interface IAuthErrorHandler {
    handleError(stage: AuthStage, error: any): Promise<void>;
}

export default IAuthErrorHandler