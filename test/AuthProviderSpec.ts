import "reflect-metadata";
import * as TypeMoq from "typemoq";
import Auth0Provider from "../scripts/auth0/Auth0Provider";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import {ISettingsManager} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";

describe("Given an auth provider", () => {
    let subject:IAuthProvider,
        settingsManager:TypeMoq.Mock<ISettingsManager>,
        locationNavigator:TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        subject = new Auth0Provider({
            clientNamespace: 'test.auth0.com',
            logoutCallbackUrl: 'http://localhost',
            loginCallbackUrl: 'http://localhost',
            renewCallbackUrl: 'http://localhost',
            clientId: 'test',
            audience: 'test-audience'
        }, settingsManager.object, locationNavigator.object);
    });

    context("when the user logs out", () => {
        beforeEach(() => {
            locationNavigator.setup(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"));
            subject.logout();
        });
        it("should erase the user settings", () => {
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_id_token", null), TypeMoq.Times.once());
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_access_token", null), TypeMoq.Times.once());
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_profile", null), TypeMoq.Times.once());
        });
        it("should redirect to the auth0 logout page", () => {
            locationNavigator.verify(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"), TypeMoq.Times.once());
        });
    });
});