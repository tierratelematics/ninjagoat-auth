import {IRoutingAdapter} from "ninjagoat";
import {injectable, inject} from "inversify";
import {PlainRoute, RouterState, RedirectFunction} from "react-router";
import {IViewModelRegistry} from "ninjagoat";
import {IComponentFactory} from "ninjagoat";
import {AreaRegistry} from "ninjagoat";
import * as path from "path";
import IAuthConfig from "../interfaces/IAuthConfig";
import IAuthProvider from "../interfaces/IAuthProvider";
import {RegistryEntry} from "ninjagoat";
import {INavigationManager} from "ninjagoat";
import * as _ from "lodash";

@injectable()
class AuthorizedRoutingAdapter implements IRoutingAdapter {
    constructor(@inject("IViewModelRegistry") private registry:IViewModelRegistry,
                @inject("IComponentFactory") private componentFactory:IComponentFactory,
                @inject("IAuthProvider") private authProvider:IAuthProvider,
                @inject("IAuthConfig") private authConfig:IAuthConfig,
                @inject("INavigationManager") private navigationManager:INavigationManager) {
    }

    routes():PlainRoute {
        let areas = this.registry.getAreas(),
            routes = this.getRoutes(areas);
        if (this.registry.getArea("NotFound")) //If there's a 404 handler
            routes.push({
                path: "*",
                component: this.componentFactory.componentForNotFound()
            });
        return {
            childRoutes: routes,
            component: this.componentFactory.componentForMaster(),
            indexRoute: {component: this.componentFactory.componentForUri("/")},
            path: "/",
            onEnter: (nextState:RouterState, replace:RedirectFunction) => {
                let entry = this.registry.getArea("Index").entries[0];
                this.handleRedirect(entry, replace);
            }
        };
    }

    private getRoutes(areas:AreaRegistry[]):PlainRoute[] {
        return <PlainRoute[]>_(areas)
            .filter(area => !_.includes(["Index", "Master", "NotFound"], area.area))
            .reduce((routes, area) => {
                routes.push(this.getRoutesForArea(area));
                return _.flatten(routes);
            }, [])
            .valueOf();
    }

    private getRoutesForArea(area:AreaRegistry):{}[] {
        return <PlainRoute[]>_(area.entries)
            .reduce((routes, entry) => {
                let id = entry.id.indexOf("Index") > -1 ? "" : entry.id.toLowerCase(),
                    route = path.join(area.area.toLowerCase(), id, entry.parameters || "");
                routes.push({
                    component: this.componentFactory.componentForUri(route),
                    path: route,
                    onEnter: (nextState:RouterState, replace:RedirectFunction) => this.handleRedirect(entry, replace)
                });
                return routes;
            }, [])
            .valueOf();
    }

    private handleRedirect(entry:RegistryEntry<any>, replace:RedirectFunction) {
        let needsAuthorization = <boolean>Reflect.getMetadata("ninjagoat:authorized", entry.construct);
        if (needsAuthorization && !this.authProvider.isLoggedIn())
            replace(this.navigationManager.getNavigationPath(this.authConfig.notAuthorizedRedirect.area, this.authConfig.notAuthorizedRedirect.viewmodelId));
    }

}

export default AuthorizedRoutingAdapter