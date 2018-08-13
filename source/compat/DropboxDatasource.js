import { Datasources } from "../library/buttercupCore.js";
import { getArchiveContents, putArchiveContents } from "./dropbox.js";

const { TextDatasource, registerDatasource } = Datasources;

const NOOP = () => {};

class DropboxDatasource extends TextDatasource {
    constructor(accessToken, resourcePath) {
        super("");
        this.path = resourcePath;
        this.token = accessToken;
    }

    load(credentials) {
        if (this.hasContent) {
            return super.load(credentials);
        }
        return getArchiveContents(this.path, this.token).then(content => {
            this.setContent(content);
            return super.load(credentials);
        });
    }

    save(history, password) {
        return super.save(history, password).then(encryptedContent => {
            return putArchiveContents(this.path, encryptedContent, this.token).then(NOOP);
        });
    }

    supportsRemoteBypass() {
        return true;
    }

    toObject() {
        return {
            type: "dropbox",
            token: this.token,
            path: this.path
        };
    }
}

DropboxDatasource.fromObject = function fromObject(obj) {
    if (obj.type === "dropbox") {
        return new DropboxDatasource(obj.token, obj.path);
    }
    throw new Error(`Unknown or invalid type: ${obj.type}`);
};

DropboxDatasource.fromString = function fromString(str, hostCredentials) {
    return DropboxDatasource.fromObject(JSON.parse(str), hostCredentials);
};

registerDatasource("dropbox", DropboxDatasource);

export default DropboxDatasource;
