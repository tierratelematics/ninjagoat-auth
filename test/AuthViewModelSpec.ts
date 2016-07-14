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
    });

    context("when it's triggered", () => {
        it("should obtain the access token and jwt and save them");
    });
});