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
        httpClient:TypeMoq.Mock<IHttpClient>,
        settingsManager:TypeMoq.Mock<ISettingsManager>,
        locationNavigator:TypeMoq.Mock<ILocationNavigator>;

    beforeEach(() => {
        httpClient = TypeMoq.Mock.ofType(HttpClient);
        locationNavigator = TypeMoq.Mock.ofType(MockLocationNavigator);
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        settingsManager.setup(s => s.setValue("auth_user_data", TypeMoq.It.isValue({
            "access_token": "at",
            "id_token": "jwt"
        })));
        subject = new Auth0Provider({
            clientNamespace: 'test.auth0.com',
            loginCallbackUrl: '',
            logoutCallbackUrl: 'http://localhost',
            clientId: 'test',
            logoutRedirect: {area: 'Index'}, loginRedirect: {area: "Index"}
        }, httpClient.object, settingsManager.object, locationNavigator.object);
    });

    context("when an endpoint is called back with jwt and access token", () => {
        beforeEach(() => subject.callback("at", "jwt"));
        it("should save the return data in the browser", () => {
            settingsManager.verify(s => s.setValue("auth_user_data", TypeMoq.It.isValue({
                access_token: "at",
                id_token: "jwt"
            })), TypeMoq.Times.once());
        });
    });

    context("when the user logs out", () => {
        beforeEach(() => {
            locationNavigator.setup(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&clientId=test"));
        });
        it("should redirect to the auth0 logout page", () => {
            subject.logout();
            locationNavigator.verify(locationNavigator => locationNavigator.navigate("https://test.auth0.com/v2/logout?returnTo=http://localhost&clientId=test"), TypeMoq.Times.once());
        });
    });
});