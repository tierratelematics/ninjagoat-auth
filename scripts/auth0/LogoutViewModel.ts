import {inject} from "inversify";
import {ViewModel} from "ninjagoat";
import {INavigationManager} from "ninjagoat";
import {ObservableViewModel} from "ninjagoat";

@ViewModel("Logout")
class LogoutViewModel implements ObservableViewModel<void> {

    constructor(@inject("INavigationManager") private navigationManager: INavigationManager) {
        this.navigationManager.navigate("Index");
    }

    onData(data: void) {

    }

}

export default LogoutViewModel