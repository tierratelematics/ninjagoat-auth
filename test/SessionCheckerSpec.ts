import "reflect-metadata";
import * as TypeMoq from "typemoq";
import SessionChecker from "../scripts/auth0/SessionChecker";
import AuthStage from "../scripts/AuthStage";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import {IUriResolver} from "ninjagoat";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
import MockUriResolver from "./fixtures/MockUriResolver";
import {Observable} from "rx";
import {AuthorizedViewModel, UnauthorizedViewModel} from "./fixtures/ViewModels";
import MockAuthErrorHandler from "./fixtures/MockAuthErrorHandler";
import {RegistryEntry} from "ninjagoat";

describe("Given a session checker", () => {

    let subject: SessionChecker,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        authErrorHandler: TypeMoq.Mock<MockAuthErrorHandler>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>,
        uriResolver: TypeMoq.Mock<IUriResolver>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        authErrorHandler = TypeMoq.Mock.ofType(MockAuthErrorHandler);
        uriResolver = TypeMoq.Mock.ofType(MockUriResolver);
        subject = new SessionChecker(authProvider.object, locationNavigator.object, uriResolver.object, authErrorHandler.object);
    });

    context("when a periodically check is started", () => {
        context("and there is an active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
                authErrorHandler.setup(e => e.handleError(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(e => Promise.resolve());
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                    return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
                uriResolver.setup(u => u.resolve("anArea/aViewModelId")).returns(u => {
                    return {area: "anArea", viewmodel: new RegistryEntry<any>(AuthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};});
            });
            it("should renew the session", (done) => {
                subject.check(1);
                Observable.timer(10).subscribe(() => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.atLeastOnce());
                    authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.never());
                    authErrorHandler.verify(e => e.handleError(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
                    done();
                });
            });
        });
        context("and there is no active sso session", () => {
            context("and the page is authorized", () => {
                beforeEach(() => {
                    authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                    authErrorHandler.setup(e => e.handleError(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(e => Promise.resolve());
                    locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                        return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
                    uriResolver.setup(u => u.resolve("anArea/aViewModelId")).returns(u => {
                        return {area: "anArea", viewmodel: new RegistryEntry<any>(AuthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};});    
                });
                it("should invoke the auth error handler for the renewal stage", (done) => {
                    subject.check(1);
                    Observable.timer(10).subscribe(() => {
                        authErrorHandler.verify(e => e.handleError(AuthStage.RENEWAL, TypeMoq.It.isAny()), TypeMoq.Times.once());
                        done();
                    });
                });
            });
            context("and the page is not authorized", () => {
                beforeEach(() => {
                    authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                    authErrorHandler.setup(e => e.handleError(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(e => Promise.resolve());
                    locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                        return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
                    uriResolver.setup(u => u.resolve("anArea/aViewModelId")).returns(u => {
                        return {area: "anArea", viewmodel: new RegistryEntry<any>(UnauthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};});    
                });
                it("should not log out the user", (done) => {
                    let subscription = subject.check(1);
                    Observable.timer(10).subscribe(() => {
                        authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.never());
                        authErrorHandler.verify(e => e.handleError(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
                        subscription.dispose();
                        done();
                    });
                });
            });
        });
    });
});