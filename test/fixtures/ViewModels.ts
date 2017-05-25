import {ObservableViewModel} from "ninjagoat";
import Authorized from "../../scripts/AuthorizedDecorator";

@Authorized()
export class AuthorizedViewModel extends ObservableViewModel<any> {
    onData(data: any) {

    }
}

export class UnauthorizedViewModel extends ObservableViewModel<any> {
    onData(data: any) {

    }
}