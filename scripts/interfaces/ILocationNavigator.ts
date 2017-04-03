interface ILocationNavigator {
    navigate(url:string);
    getCurrentLocation():Location;
}

export default ILocationNavigator