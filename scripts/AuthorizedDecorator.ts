function Authorized() {
    return function (target:any) {
        Reflect.defineMetadata("ninjagoat:authorized", false, target);
        return target;
    };
}

export default Authorized