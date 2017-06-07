import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import Auth0Provider from "../scripts/auth0/Auth0Provider";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import {ISettingsManager} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";

describe("Given an auth provider", () => {
    let subject: Auth0Provider,
        settingsManager: TypeMoq.Mock<ISettingsManager>,
        locationNavigator: TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        subject = new Auth0Provider({
            clientNamespace: "test.auth0.com",
            logoutCallbackUrl: "http://localhost",
            loginCallbackUrl: "http://localhost",
            renewCallbackUrl: "http://localhost",
            clientId: "test",
            audience: "test-audience"
        }, settingsManager.object, locationNavigator.object);
    });

    context("when the user logs out", () => {
        beforeEach(() => {
            locationNavigator.setup(l => l.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"));
            subject.logout();
        });
        it("should erase the user settings", () => {
            settingsManager.verify(s => s.setValue("auth_id_token", null), TypeMoq.Times.once());
            settingsManager.verify(s => s.setValue("auth_access_token", null), TypeMoq.Times.once());
            settingsManager.verify(s => s.setValue("auth_profile", null), TypeMoq.Times.once());
        });
        it("should redirect to the auth0 logout page", () => {
            locationNavigator.verify(l => l.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"), TypeMoq.Times.once());
        });
    });

    context("when the user id is requested", () => {
        beforeEach(() => {
           settingsManager.setup(s => s.getValue("auth_profile")).returns(() => {
              return {
                  "test-audience/app_metadata": {
                      "userId": "282807202"
                  }
              };
           });
        });
        it("should be retrieved from settings", () => {
            expect(subject.getUserId()).to.be("282807202");
        });
    });
});