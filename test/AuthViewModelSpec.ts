import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import AuthViewModel from "../scripts/auth0/AuthViewModel";
import IHashRetriever from "../scripts/interfaces/IHashRetriever";
import IAuthProvider from "../scripts/interfaces/IAuthProvider";
import MockHashRetriever from "./fixtures/MockHashRetriever";
import Auth0Provider from "../scripts/auth0/Auth0Provider";

describe("Given an auth viewmodel", () => {
    let subject:AuthViewModel,
        hashRetriever:TypeMoq.Mock<IHashRetriever>,
        authProvider:TypeMoq.Mock<IAuthProvider>;

    beforeEach(() => {
        hashRetriever = TypeMoq.Mock.ofType(MockHashRetriever);
        authProvider = TypeMoq.Mock.ofType(Auth0Provider);
        hashRetriever.setup(hashRetriever => hashRetriever.retrieveHash()).returns(a => '#access_token=at&id_token=it&type=bearer');
        authProvider.setup(authProvider => authProvider.callback('at', 'it')).returns(a => null);
        subject = new AuthViewModel(hashRetriever.object,  authProvider.object);
    });

    context("when it's triggered", () => {
        it("should obtain the access token and jwt and save them", () => {
            authProvider.verify(authProvider => authProvider.callback('at', 'it'), TypeMoq.Times.once());
        });
    });
});