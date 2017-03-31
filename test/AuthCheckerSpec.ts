import "reflect-metadata";
import * as TypeMoq from "typemoq";
import AuthChecker from "../scripts/auth0/AuthChecker";
import MockAuthProvider from "./fixtures/MockAuthProvider";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
import {Observable} from "rx";

describe("Given an auth checker", () => {

    let subject: AuthChecker,
        authProvider: TypeMoq.Mock<MockAuthProvider>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        authProvider = TypeMoq.Mock.ofType(MockAuthProvider);
        subject = new AuthChecker(authProvider.object, locationNavigator.object);
    });

    context("when a periodically check is started", () => {
        context("and there is an active sso session", () => {
            beforeEach(() => {
                authProvider.setup(a => a.renewAuth()).returns(a => Promise.resolve(null));
                locationNavigator.setup(l => l.getCurrentLocation()).returns(l => {return <any>{origin: "http://test.com", path: "page", hash: "", href: "http://test.com/page"};});
            });
            it("should renew the session", (done) => {
                subject.check(0.001);
                Observable.timer(1.5).subscribe(() => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
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
                subject.check(0.001);
                Observable.timer(1.5).subscribe(() => {
                    authProvider.verify(a => a.renewAuth(), TypeMoq.Times.once());
                    authProvider.verify(a => a.logout(TypeMoq.It.isAny()), TypeMoq.Times.once());
                    done();
                });


            });
        });
    });
});