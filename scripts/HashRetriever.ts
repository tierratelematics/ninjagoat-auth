import IHashRetriever from "./interfaces/IHashRetriever";
import {injectable} from "inversify";

@injectable()
class HashRetriever implements IHashRetriever {
    retrieveHash():string {
        return window.location.hash;
    }
}

export default HashRetriever