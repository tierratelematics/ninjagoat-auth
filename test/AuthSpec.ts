import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import {IHttpClient} from "ninjagoat";
import Auth0Provider from "../scripts/auth0/Auth0Provider";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import {ISettingsManager} from "ninjagoat";
import {HttpClient} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";
import {HttpResponse} from "ninjagoat";
import {Observable, Scheduler} from "rx";
const auth0_response = require("./fixtures/auth0_response.json");

describe("Given an auth provider", () => {
    let subject:IAuthProvider,
        httpClient:TypeMoq.Mock<IHttpClient>,
        settingsManager:TypeMoq.Mock<ISettingsManager>;

    beforeEach(() => {
        httpClient = TypeMoq.Mock.ofType(HttpClient);
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        settingsManager.setup(s => s.setValue("auth_user_data", TypeMoq.It.isValue({
            "access_token": "at",
            "id_token": "jwt"
        })));
        subject = new Auth0Provider({
            clientNamespace: 'test.auth0.com',
            clientCallbackUrl: '',
            clientId: '',
            redirectTo: {area: 'Index'}
        }, httpClient.object, settingsManager.object);
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
            settingsManager.setup(settingsManager => settingsManager.setValue("auth_user_data", null));
            httpClient.setup(httpClient => httpClient.get('https://test.auth0.com/logout')).returns(a => {
                return Observable.just(new HttpResponse(null, 200));
            });
        });
        it("should clear the saved authentication data", () => {
            subject.logout().subscribe(() => null);
            settingsManager.verify(settingsManager => settingsManager.setValue("auth_user_data", null), TypeMoq.Times.once());
        });
    });
});