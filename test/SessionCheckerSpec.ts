import "reflect-metadata";
import * as TypeMoq from "typemoq";
import SessionChecker from "../scripts/auth0/SessionChecker";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import {IUriResolver} from "ninjagoat";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
import MockUriResolver from "./fixtures/MockUriResolver";
import {Observable} from "rx";
import {AuthorizedViewModel, UnauthorizedViewModel} from "./fixtures/ViewModels";
import {RegistryEntry} from "ninjagoat";

describe("Given a session checker", () => {

    let subject: SessionChecker,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>,
        uriResolver: TypeMoq.Mock<IUriResolver>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        uriResolver = TypeMoq.Mock.ofType(MockUriResolver);
        subject = new SessionChecker(authProvider.object, locationNavigator.object, uriResolver.object);
    });

    context("when a periodically check is started", () => {
        context("and there is an active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
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
                    done();
                });
            });
        });
        context("and there is no active sso session", () => {
            context("and the page is authorized", () => {
                beforeEach(() => {
                    authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                    locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                        return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
                    uriResolver.setup(u => u.resolve("anArea/aViewModelId")).returns(u => {
                        return {area: "anArea", viewmodel: new RegistryEntry<any>(AuthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};});    
                });
                it("should log out the user", (done) => {
                    subject.check(1);
                    Observable.timer(10).subscribe(() => {
                        authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.once());
                        done();
                    });
                });
            });
            context("and the page is not authorized", () => {
                beforeEach(() => {
                    authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                    locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {
                        return <any>{origin: "http://test.com", pathname: "anArea/aViewModelId", hash: "", href: "http://test.com/anArea/aViewModelId"};});
                    uriResolver.setup(u => u.resolve("anArea/aViewModelId")).returns(u => {
                        return {area: "anArea", viewmodel: new RegistryEntry<any>(UnauthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};});    
                });
                it("should not log out the user", (done) => {
                    let subscription = subject.check(1);
                    Observable.timer(10).subscribe(() => {
                        authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.never());
                        subscription.dispose();
                        done();
                    });
                });
            });
        });
    });
});