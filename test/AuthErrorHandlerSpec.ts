import "reflect-metadata";
import * as TypeMoq from "typemoq";
import AuthErrorHandler from "../scripts/auth0/AuthErrorHandler";
import AuthStage from "../scripts/AuthStage";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";

describe("Given an auth error handler", () => {

    let subject: AuthErrorHandler,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        subject = new AuthErrorHandler(authProvider.object, locationNavigator.object);
    });

    context("when there is an error during login stage", () => {
        beforeEach(() => {
            authProvider.setup(a => a.login(TypeMoq.It.isAny()));
            locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
        });
        it("should ask the user to login again", () => {
            subject.handleError(AuthStage.LOGIN, TypeMoq.It.isAny());
            authProvider.verify(a => a.login("http://test.com/anArea/aViewModelId"), TypeMoq.Times.once());
        });
    });
    context("when there is an error after the login redirect stage", () => {
        beforeEach(() => {
            authProvider.setup(a => a.login(TypeMoq.It.isAny()));
            locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "#error=error", href: "http://test.com/anArea/aViewModelId#error=error"};});
        });
        it("should ask the user to login again", () => {
            subject.handleError(AuthStage.LOGIN, TypeMoq.It.isAny());
            authProvider.verify(a => a.login("http://test.com/anArea/aViewModelId"), TypeMoq.Times.once());
        });
    });
    context("when there is an error during renewal stage", () => {
        beforeEach(() => {
            authProvider.setup(a => a.logout(TypeMoq.It.isAny()));
            locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});    
        });
        it("should logout the user", () => {
            subject.handleError(AuthStage.RENEWAL, TypeMoq.It.isAny());
            authProvider.verify(a => a.logout("http://test.com/anArea/aViewModelId"), TypeMoq.Times.once());
        });
    });
});