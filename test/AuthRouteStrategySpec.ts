import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";

describe("Given a viewmodel", () => {

    context("when an authorization is needed to access that page", () => {
        context("and a saved token is present", () => {

        });

        context("and a saved token is not present", () => {
            context("but a SSO is active", () => {
                it("should SSO the user into the system");
            });

            context("but a SSO is not active", () => {
                it("should redirect the user to the login page");
            });
        });
    });

    context("when an authorization is not needed to access that page", () => {
        it("should allow the user");
    });
});