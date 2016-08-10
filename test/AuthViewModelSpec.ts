import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import {INavigationManager} from "ninjagoat";
import MockNavigationManager from "./fixtures/MockNavigationManager";
import LogoutViewModel from "../scripts/auth0/LogoutViewModel";
import {ISettingsManager} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";

describe("Given a logout viewmodel", () => {

    let subject:LogoutViewModel,
        navigationManager:TypeMoq.Mock<INavigationManager>,
        settingsManager:TypeMoq.Mock<ISettingsManager>;

    beforeEach(() => {
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        navigationManager = TypeMoq.Mock.ofType(MockNavigationManager);
        navigationManager.setup(navigationManager => navigationManager.navigate('Login', undefined));
        subject = new LogoutViewModel(settingsManager.object, {
            clientNamespace: 'test.auth0.com',
            logoutCallbackUrl: '',
            clientId: '',
            notAuthorizedRedirect: {area: 'Login'},
            connection: ""
        }, navigationManager.object);
    });

    context("when it's triggered", () => {
        it("should clear the saved access token and jwt", () => {
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_id_token", null), TypeMoq.Times.once());
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_access_token", null), TypeMoq.Times.once());
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_profile", null), TypeMoq.Times.once());
        });

        it("should redirect the user to the configured return page", () => {
            navigationManager.verify(navigationManager => navigationManager.navigate('Login', undefined), TypeMoq.Times.once());
        });
    });
});