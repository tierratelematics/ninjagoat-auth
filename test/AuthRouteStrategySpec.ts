import "reflect-metadata";
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
            renewCallbackUrl: "",
            audience: "test-audience"
        });
    });

    context("when an authorization is needed to access that page", () => {
        let entry = {
            construct: AuthorizedViewModel,
            id: null,
            observableFactory: null,
            parameters: null
        };
        context("and a sso session is active", () => {
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{origin: "http://test.com", path: "page", hash: "", href: "http://test.com/page"};});
            });
            it("should not request the user to login", () => {
                subject.enter(entry, null);
                authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                authProvider.verify(a => a.login(TypeMoq.It.isAny()), TypeMoq.Times.never());
            });
        });

        context("and there is no active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.login(TypeMoq.It.isAny()));
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{origin: "http://test.com", path: "page", hash: "", href: "http://test.com/page"};});
            });
            it("should request the user to login", () => {
                return subject.enter(entry, null).then(() => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                    authProvider.verify(a => a.login(TypeMoq.It.isAny()), TypeMoq.Times.once());
                });
            });
        });
    });

    context("when an authorization is not needed to access that page", () => {
        beforeEach(() => {
            authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
        });
        it("should allow the user", () => {
            subject.enter({
                construct: UnauthorizedViewModel,
                id: null,
                observableFactory: null,
                parameters: null
            }, null);
            authProvider.verify(a => a.renewAuth(), TypeMoq.Times.never());
        });
    });
});