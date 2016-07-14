import {ISettingsManager} from "ninjagoat";

class MockSettingsManager implements ISettingsManager {

    getValue<T>(key:string, fallback:T):T {
        return null;
    }

    setValue<T>(key:string, value:T):void {
    }

}

export default MockSettingsManager