import IHashRetriever from "../../scripts/interfaces/IHashRetriever";

class MockHashRetriever implements IHashRetriever {

    retrieveHash():string {
        return undefined;
    }

}

export default MockHashRetriever