import "reflect-metadata";
import * as TypeMoq from "typemoq";
import expect = require("expect.js");
import AuthRouteStrategy from "../scripts/auth0/AuthRouteStrategy";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import IAuthDataRetriever from "../scripts/interfaces/IAuthDataRetriever";
import {UnauthorizedViewModel, AuthorizedViewModel} from "./fixtures/ViewModels";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
import {Observable} from "rx";

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
            loginCallbackUrl: "http://test.com/page",
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
                authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                    return <any>{origin: "http://test.com", pathname: "/page", hash: "", href: "http://test.com/page"};});
            });
            context("and the user accesses the page for the first time", () => {
                it("should not request the user to login and should renew the authentication", () => {
                    subject.enter(entry, null);
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                    authProvider.verify(a => a.login(TypeMoq.It.isAny()), TypeMoq.Times.never());
                });
            });
            context("and the user accesses the page when already authenticated", () => {
                it("should not request the user to login and should not renew the authentication the second time", (done) => {
                    subject.enter(entry, null).then(() => {subject.enter(entry, null);});
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                    Observable.timer(10).subscribe(() => {
                        authProvider.verify(a => a.requestSSOData(), TypeMoq.Times.once());
                        done();
                    });
                });
            });
        });

        context("and there is no active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.login(TypeMoq.It.isAny()));
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                    return <any>{origin: "http://test.com", pathname: "/page", hash: "", href: "http://test.com/page"};});
            });
            it("should request the user to login", () => {
                return subject.enter(entry, null).then(() => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                    authProvider.verify(a => a.login(TypeMoq.It.isAny()), TypeMoq.Times.once());
                });
            });
        });

        context("and the url is the login callback url and it contains the hash with the authentication result", () => {
            beforeEach(() => {
                authProvider.setup(a => a.login(TypeMoq.It.isAny()));
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
                authProvider.setup(a => a.parseHash(TypeMoq.It.isAny())).returns(a => Promise.resolve({state: "http%3A%2F%2Ftest.com%2Fpage%2FnewPage"}));
                authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{
                    origin: "http://test.com",
                    pathname: "/page",
                    hash: "#access_token=access_token&id_token=id_token&state=http%3A%2F%2Ftest.com%2Fpage%2FnewPage",
                    href: "http://test.com/page"};});
            });
            it("should redirect the user to the url present in the state", () => {
                return subject.enter(entry, null).then((path) => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.never());
                    authProvider.verify(a => a.requestSSOData(), TypeMoq.Times.never());
                    authProvider.verify(a => a.login(TypeMoq.It.isAny()), TypeMoq.Times.never());
                    expect(path).to.be("/page/newPage");
                });
            });
        });
    });

    context("when an authorization is not needed to access that page", () => {
        beforeEach(() => {
            authProvider.setup(a => a.requestSSOData()).returns(a => Promise.resolve(null));
            authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
        });
        it("should allow the user", () => {
            subject.enter({
                construct: UnauthorizedViewModel,
                id: null,
                observableFactory: null,
                parameters: null
            }, null);
            authProvider.verify(a => a.requestSSOData(), TypeMoq.Times.never());
            authProvider.verify(a => a.renewAuth(), TypeMoq.Times.never());
        });
    });
});