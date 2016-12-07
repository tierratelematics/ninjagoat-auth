import ILocationNavigator from "./interfaces/ILocationNavigator";
import {injectable} from "inversify";

@injectable()
class LocationNavigator implements ILocationNavigator {

    navigate(url:string) {
        location.href = url;
    }

    getCurrentLocation(): string {
        return location.href;
    }

}

export default LocationNavigator