import ILocationNavigator from "../../scripts/interfaces/ILocationNavigator";

class MockLocationNavigator implements ILocationNavigator {
    getCurrentLocation(): string {
        return undefined;
    }

    navigate(url:string) {
    }

}

export default MockLocationNavigator