import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import AuthRouteStrategy from "../scripts/auth0/AuthRouteStrategy";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import IAuthDataRetriever from "../scripts/interfaces/IAuthDataRetriever";
import {UnauthorizedViewModel, AuthorizedViewModel} from "./fixtures/ViewModels";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";

describe("Given a ViewModel", () => {

    let subject: AuthRouteStrategy,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        subject = new AuthRouteStrategy(authProvider.object, <IAuthDataRetriever>authProvider.object, locationNavigator.object, {
            clientId: "",
            clientNamespace: "",
            loginCallbackUrl: "",
            logoutCallbackUrl: "",
            connection: "test-connection"
        });
    });

    context("when an authorization is needed to access that page", () => {
        let entry = {
            construct: AuthorizedViewModel,
            id: null,
            observableFactory: null,
            parameters: null
        };
        context("and a saved token is present", () => {
            beforeEach(() => {
                authProvider.setup(a => a.getIDToken()).returns(a => "testIdToken");
                authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve(null));
            });
            it("should not trigger any other calls", () => {
                subject.enter(entry, null);
                authProvider.verify(a => a.requestSSOData(), TypeMoq.Times.never());
            });
        });

        context("and a saved token is not present", () => {
            beforeEach(() => {
                authProvider.setup(a => a.getIDToken()).returns(a => null);
                authProvider.setup(a => a.login(TypeMoq.It.isAny(), TypeMoq.It.isAny()));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(a => "http://test.com/page");
            });
            context("but a SSO is active", () => {
                beforeEach(() => authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve({
                    sso: true,
                    lastUsedConnection: {name: "last-connection"}
                })));
                it("should SSO the user into the system", () => {
                    return subject.enter(entry, null).then(() => {
                        authProvider.verify(a => a.login("http://test.com/page", "test-connection"), TypeMoq.Times.once());
                    });
                });
            });

            context("but a SSO is not active", () => {
                beforeEach(() => authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve(
                    {sso: false}
                )));
                it("should redirect the user to the login page", () => {
                    return subject.enter(entry, null).then(() => {
                        authProvider.verify(a => a.login("http://test.com/page", null), TypeMoq.Times.once());
                    });
                });
            });
        });
    });

    context("when an authorization is not needed to access that page", () => {
        beforeEach(() => authProvider.setup(a => a.getIDToken()));
        it("should allow the user", () => {
            subject.enter({
                construct: UnauthorizedViewModel,
                id: null,
                observableFactory: null,
                parameters: null
            }, null);
            authProvider.verify(a => a.getIDToken(), TypeMoq.Times.never());
        });
    });
});