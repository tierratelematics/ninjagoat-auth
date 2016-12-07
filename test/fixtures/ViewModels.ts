import {ObservableViewModel} from "ninjagoat";
import Authorized from "../../scripts/AuthorizedDecorator";

@Authorized()
export class AuthorizedViewModel extends ObservableViewModel<void> {
    onData(data: void) {

    }
}

export class UnauthorizedViewModel extends ObservableViewModel<void> {
    onData(data: void) {

    }
}