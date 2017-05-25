import {IUriResolver, RegistryEntry} from "ninjagoat";
import {Observable} from "rx";
import {AuthorizedViewModel} from "./ViewModels";

class MockUriResolver implements IUriResolver {

    resolve<T>(uri:string):{ area:string, viewmodel:RegistryEntry<T> } {
        return {area: "anArea", viewmodel: new RegistryEntry<any>(AuthorizedViewModel, "aViewModelId", context => Observable.just({}), "")};
    }

}

export default MockUriResolver