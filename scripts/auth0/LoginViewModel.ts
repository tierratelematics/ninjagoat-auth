import {ViewModel} from "ninjagoat";
import {ObservableViewModel} from "ninjagoat";

@ViewModel("Login")
class LoginViewModel extends ObservableViewModel<void> {

    constructor() {
        super();
    }

    onData(data:void) {

    }
}

export default LoginViewModel