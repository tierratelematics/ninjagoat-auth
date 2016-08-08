function Authorized() {
    return function (target:any) {
        Reflect.defineMetadata("ninjagoat:authorized", true, target);
        return target;
    };
}

export default Authorized