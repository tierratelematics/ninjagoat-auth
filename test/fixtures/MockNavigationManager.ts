import {INavigationManager} from "ninjagoat";
import {Dictionary} from "ninjagoat";

class MockNavigationManager implements INavigationManager {
    replace(area: string, viewmodelId?: string, parameters?: Dictionary<any>): void {
    }

    getNavigationPath(area:string, viewmodelId?:string, parameters?:Dictionary<any>):string {
        return undefined;
    }

    navigate(area:string, viewmodelId?:string, parameters?:Dictionary<any>):void {
    }

}

export default MockNavigationManager