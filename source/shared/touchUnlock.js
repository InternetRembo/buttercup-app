import TouchID from "react-native-touch-id";
import { getGenericPassword, setGenericPassword } from "react-native-keychain";
import { getValue, setValue } from "../library/storage.js";
import { handleError } from "../global/exceptions.js";
import { executeNotification } from "../global/notify.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getState } from "../store.js";
import { getSharedArchiveManager } from "../library/buttercup.js";

const TOUCH_ID_ENABLED_PREFIX = "bcup:touchid-unlock-enabled:source:";

export function disableTouchUnlock(sourceID) {
    const storageKey = `${TOUCH_ID_ENABLED_PREFIX}${sourceID}`;
    return getGenericPassword()
        .then(keychainCreds => {
            const newCreds = removeSourceFromKeychainCredentials(keychainCreds.password);
            return setGenericPassword("-", newCreds);
        })
        .then(() => setValue(storageKey, false))
        .catch(error => {
            handleError("Failed disabling touch unlock", error);
        });
}

export function enableTouchUnlock(sourceID) {
    const storageKey = `${TOUCH_ID_ENABLED_PREFIX}${sourceID}`;
    TouchID.authenticate("Authenticate to enable touch unlock")
        .then(() => getGenericPassword())
        .then(keychainCreds => {
            const archiveManager = getSharedArchiveManager();
            const state = getState();
            const sourceID = getSelectedSourceID(state);
            const source = archiveManager.sources[archiveManager.indexOfSource(sourceID)];
            if (!source) {
                throw new Error("Current source was not found");
            }
            const masterPassword = source.workspace.primary.credentials.password;
            if (!masterPassword) {
                throw new Error("Unable to locate current credentials");
            }
            const newCreds = updateKeychainCredentials(keychainCreds.password, sourceID, masterPassword);
            return setGenericPassword("-", newCreds);
        })
        .then(() => setValue(storageKey, true))
        .then(() => {
            executeNotification("success", "Touch Unlock", "Successfully enabled touch unlock");
        })
        .catch(error => {
            handleError("Failed enabling touch unlock", error);
        });
}

export function getMasterPasswordFromTouchUnlock(sourceID) {
    return touchIDEnabledForSource(sourceID)
        .then(enabled => {
            if (!enabled) {
                throw new Error("Touch unlock is not enabled for this source");
            }
            return TouchID.authenticate("Authenticate to open archive");
        })
        .then(() => getGenericPassword())
        .then(keychainCreds => {
            const items = JSON.parse(keychainCreds.password);
            const sourcePassword = items[sourceID];
            if (!sourcePassword) {
                throw new Error("No credentials found under touch ID for this source");
            }
            return sourcePassword;
        })
        .catch(err => {
            switch (err.name) {
                case "LAErrorSystemCancel":
                /* falls-through */
                case "LAErrorUserCancel":
                    return { action: "cancel" };
                case "LAErrorUserFallback":
                    return { action: "fallback" };
                default:
                    throw err;
            }
        });
}

function removeSourceFromKeychainCredentials(keychainCreds, sourceID) {
    const credsObj = typeof keychainCreds === "string" && keychainCreds.length > 0 ? JSON.parse(keychainCreds) : {};
    delete credsObj[sourceID];
    return JSON.stringify(credsObj);
}

export function touchIDEnabledForSource(sourceID) {
    const storageKey = `${TOUCH_ID_ENABLED_PREFIX}${sourceID}`;
    return getValue(storageKey, false);
}

function updateKeychainCredentials(keychainCreds, sourceID, password) {
    const credsObj = typeof keychainCreds === "string" && keychainCreds.length > 0 ? JSON.parse(keychainCreds) : {};
    credsObj[sourceID] = password;
    return JSON.stringify(credsObj);
}
