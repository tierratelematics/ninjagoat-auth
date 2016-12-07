import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import {INavigationManager} from "ninjagoat";
import MockNavigationManager from "./fixtures/MockNavigationManager";
import LogoutViewModel from "../scripts/auth0/LogoutViewModel";

describe("Given a logout viewmodel", () => {

    let subject:LogoutViewModel,
        navigationManager:TypeMoq.Mock<INavigationManager>;

    beforeEach(() => {
        navigationManager = TypeMoq.Mock.ofType(MockNavigationManager);
        navigationManager.setup(navigationManager => navigationManager.navigate('Login'));
        subject = new LogoutViewModel(navigationManager.object);
    });

    context("when it's triggered", () => {
        it("should redirect the user to the index page", () => {
            navigationManager.verify(navigationManager => navigationManager.navigate('Index'), TypeMoq.Times.once());
        });
    });
});