import "reflect-metadata";
import * as TypeMoq from "typemoq";
import SessionChecker from "../scripts/auth0/SessionChecker";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
import {Observable} from "rx";

describe("Given a session checker", () => {

    let subject: SessionChecker,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        subject = new SessionChecker(authProvider.object, locationNavigator.object);
    });

    context("when a periodically check is started", () => {
        context("and there is an active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{origin: "http://test.com", path: "page", hash: "", href: "http://test.com/page"};});
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
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.reject(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{origin: "http://test.com", path: "page", hash: "", href: "http://test.com/page"};});
            });
            it("should log out the user", (done) => {
                subject.check(1);
                Observable.timer(10).subscribe(() => {
                    authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.once());
                    done();
                });


            });
        });
    });
});