import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import AuthViewModel from "../scripts/auth0/AuthViewModel";
import IHashRetriever from "../scripts/interfaces/IHashRetriever";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import MockHashRetriever from "./fixtures/MockHashRetriever";
import Auth0Provider from "../scripts/auth0/Auth0Provider";
import {INavigationManager} from "ninjagoat";
import MockNavigationManager from "./fixtures/MockNavigationManager";

describe("Given an auth viewmodel", () => {
    let subject:AuthViewModel,
        hashRetriever:TypeMoq.Mock<IHashRetriever>,
        authProvider:TypeMoq.Mock<IAuthProvider>,
        navigationManager:TypeMoq.Mock<INavigationManager>;

    beforeEach(() => {
        hashRetriever = TypeMoq.Mock.ofType(MockHashRetriever);
        authProvider = TypeMoq.Mock.ofType(Auth0Provider);
        navigationManager = TypeMoq.Mock.ofType(MockNavigationManager);
        navigationManager.setup(navigationManager => navigationManager.navigate('Index', undefined)).returns(a => null);
        hashRetriever.setup(hashRetriever => hashRetriever.retrieveHash()).returns(a => '#access_token=at&id_token=it&type=bearer');
        authProvider.setup(authProvider => authProvider.callback('at', 'it')).returns(a => null);
        subject = new AuthViewModel(hashRetriever.object, authProvider.object, {
            clientNamespace: '',
            clientCallbackUrl: '',
            clientId: '',
            redirectTo: {area: 'Index'}
        }, navigationManager.object);
    });

    context("when it's triggered", () => {
        it("should obtain the access token and jwt and save them", () => {
            authProvider.verify(authProvider => authProvider.callback('at', 'it'), TypeMoq.Times.once());
        });
        it("should redirect to the specified page", () => {
            navigationManager.verify(navigationManager => navigationManager.navigate('Index', undefined), TypeMoq.Times.once());
        });
    });
});