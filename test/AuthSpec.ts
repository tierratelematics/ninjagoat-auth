import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import {IHttpClient} from "ninjagoat";
import Auth0Provider from "../scripts/auth0/Auth0Provider";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import {ISettingsManager} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";
import ILocationNavigator from "../scripts/interfaces/ILocationNavigator";
import MockLocationNavigator from "./fixtures/MockLocationNavigator";
const auth0_response = require("./fixtures/auth0_response.json");

describe("Given an auth provider", () => {
    let subject:IAuthProvider,
        settingsManager:TypeMoq.Mock<ISettingsManager>,
        locationNavigator:TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        settingsManager.setup(s => s.setValue("auth_user_data", TypeMoq.It.isValue({
            "access_token": "at",
            "id_token": "jwt"
        })));
        subject = new Auth0Provider({
            clientNamespace: 'test.auth0.com',
            logoutCallbackUrl: 'http://localhost',
            clientId: 'test',
            logoutRedirect: {area: 'Index'}
        }, settingsManager.object, locationNavigator.object);
    });

    context("when the user wants to log in", () => {
        context("and some credentials are not provided", () => {
            it("should throw an error", (done) => {
                subject.login(null, "foo").catch(error => done());
            });
        });
    });

    context("when the user wants to signup", () => {
        context("and some credentials are not provided", () => {
            it("should throw an error", (done) => {
                subject.signup(null, "foo").catch(error => done());
            });
        });
    });

    context("when the user wants to retrieve the password", () => {
        context("and some credentials are not provided", () => {
            it("should throw an error", (done) => {
                subject.changePassword(null).catch(error => done());
            });
        });
    });


    context("when the user logs out", () => {
        beforeEach(() => {
            locationNavigator.setup(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"));
        });
        it("should redirect to the auth0 logout page", () => {
            subject.logout();
            locationNavigator.verify(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&client_id=test"), TypeMoq.Times.once());
        });
    });
});