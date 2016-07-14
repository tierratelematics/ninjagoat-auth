import expect = require("expect.js");
import * as TypeMoq from "typemoq";

describe("Given the AuthManager", () => {
    context("when an endpoint is called back with a code", () => {
        context("when the token is valid", () => {
            it("should return the user data");
            it("should save the user data in the browser");
        });
        context("when the token is not valid", () => {
            it("should throw an error");
        });
    });
});