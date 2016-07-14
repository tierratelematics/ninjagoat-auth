import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import AuthHttpClient from "../scripts/auth0/AuthHttpClient";
import {ISettingsManager} from "ninjagoat";
import MockSettingsManager from "./fixtures/MockSettingsManager";
import {IHttpClient} from "ninjagoat";
import MockHttpClient from "./fixtures/MockHttpClient";
import It = TypeMoqIntern.It;
import {Dictionary} from "ninjagoat";
const auth0_response = require("./fixtures/auth0_response.json");

describe("Given an http client", () => {
    let subject:AuthHttpClient,
        settingsManager:TypeMoq.Mock<ISettingsManager>,
        decoratedHttpClient:TypeMoq.Mock<IHttpClient>;

    beforeEach(() => {
        settingsManager = TypeMoq.Mock.ofType(MockSettingsManager);
        decoratedHttpClient = TypeMoq.Mock.ofType(MockHttpClient);
        decoratedHttpClient.setup(decoratedHttpClient => decoratedHttpClient.get('/test', TypeMoq.It.isAny())).returns(a => null);
        decoratedHttpClient.setup(decoratedHttpClient => decoratedHttpClient.get('/test', undefined)).returns(a => null);
        subject = new AuthHttpClient(decoratedHttpClient.object, settingsManager.object);
    });

    context("when the user data are stored in the browser", () => {
        beforeEach(() => settingsManager.setup(settingsManager => settingsManager.getValue("auth_user_data")).returns(a => auth0_response));
        it("should authorize an http call using those data", () => {
            subject.get("/test");
            decoratedHttpClient.verify(decoratedHttpClient => decoratedHttpClient.get('/test',  TypeMoq.It.isValue(<Dictionary<string>>{
                'Authorization': "Bearer jwt"
            })), TypeMoq.Times.once());
        });
    });

    context("when there are no user data stored in the browser", () => {
        beforeEach(() => settingsManager.setup(settingsManager => settingsManager.getValue("auth_user_data")).returns(a => null));
        it("should not authorize an http call", () => {
            subject.get("/test");
            decoratedHttpClient.verify(decoratedHttpClient => decoratedHttpClient.get('/test', TypeMoq.It.isValue(<Dictionary<string>>{
                'Authorization': "Bearer jwt"
            })), TypeMoq.Times.never());
        });
    });
});