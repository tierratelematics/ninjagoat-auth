import ILocationNavigator from "./interfaces/ILocationNavigator";

class LocationNavigator implements ILocationNavigator {

    navigate(url:string) {
        location.href = url;
    }

}

export default LocationNavigator