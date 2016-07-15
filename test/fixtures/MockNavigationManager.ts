import {INavigationManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";

class MockNavigationManager implements INavigationManager {

    navigate(area:string, viewmodelId?:string, parameters?:Dictionary<any>):void {
    }

}

export default MockNavigationManager