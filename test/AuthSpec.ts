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
const profile_json = require("./fixtures/profile.json");

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
        }))).returns(a => null);
        subject = new Auth0Provider({
            clientNamespace: 'test',
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

    context("when the user profile needs to be retrieved", () => {
        beforeEach(() => {
            httpClient.setup(h => h.post("https://test.auth0.com/tokeninfo", TypeMoq.It.isAny())).returns(a => {
                return Observable.just(new HttpResponse(profile_json, 200)).observeOn(Scheduler.immediate);
            });
            settingsManager.setup(settingsManager => settingsManager.getValue("auth_user_data")).returns(a => {
                return {
                    "access_token": "at",
                    "id_token": "jwt"
                };
            })
        });
        context("and the access token is valid", () => {
            it("should return the user profile", () => {
                subject.getProfile();
                httpClient.verify(httpClient => httpClient.post("https://test.auth0.com/tokeninfo", TypeMoq.It.isValue({
                    id_token: 'jwt'
                })), TypeMoq.Times.once());
            });
        });
    });
});