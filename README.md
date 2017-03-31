# Ninjagoat-auth

This module can be used to add an auto redirect to an SSO provider ([auth0](https://auth0.com) it's currently implemented, but you can change that).
Some other features are:

* Selective enable authentication on viewmodels
* Authenticated http client registered automatically
* Single Sign On
* Single Sing Out
* Tokens renewal
* User profile retrieve
* OIDC compliant authorization flow

## Installation

`
$ npm install ninjagoat-auth
`

Add this code to the boostrapper.ts file:

```typescript
import {AuthModule} from "ninjagoat-auth"

application.register(new AuthModule());
```

## Usage

Add an authorization config to one of your modules to configure auth0 credentials and redirections.

```typescript
import {IAuthConfig} from "ninjagoat-auth";

container.bind<IAuthConfig>("IAuthConfig").toConstantValue({
    clientId:"your client id",
    clientNamespace:"your namespace",
    loginCallbackUrl:"landing page after log in",
    logoutCallbackUrl:"landing page after log out",
    renewCallbackUrl: "page loaded in a hidden iframe to perform silent authentication",
    audience:"your api audience",
    scope: "your scope (default openid)"
});
```

To authenticate a given viewmodel just add an Authorized decorator. For example:

```typescript
import {Authorized} from "ninjagoat-auth"

@Authorized()
export class AuthorizedViewModel extends ObservableViewModel<void> {
    onData(data: void) {

    }
}
```
And when the user hits this page all the authentication flow is done automatically.


To activate the periodic tokens renewal and single sign on session check, inject in your MaserViewModel the IAuthChecker and start it specifying an interval in seconds. For example:

```typescript
import {IAuthChecker} from "ninjagoat-auth";

@ViewModel("Root")
export class MasterViewModel extends ObservableViewModel<void> {

    constructor(@inject("IAuthChecker") private authChecker: IAuthChecker) {
        this.authChecker.check(10);
    }


    onData(data: void) {

    }
}
```

### Authentication flow

Have a look at the [authentication flow spec](https://github.com/tierratelematics/ninjagoat-auth/blob/master/test/AuthRouteStrategySpec.ts) to get some insights.

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
