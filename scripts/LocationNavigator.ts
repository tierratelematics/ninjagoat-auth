import ILocationNavigator from "./interfaces/ILocationNavigator";
import {injectable} from "inversify";

@injectable()
class LocationNavigator implements ILocationNavigator {

    navigate(url:string) {
        location.href = url;
    }

}

export default LocationNavigator