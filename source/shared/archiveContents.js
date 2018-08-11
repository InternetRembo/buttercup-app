import { getSharedArchiveManager } from "../library/buttercup.js";
import { dispatch, getState } from "../store.js";
import { setGroups } from "../actions/archiveContents.js";
import { getSelectedArchive } from "../selectors/archiveContents.js";
import { doAsyncWork } from "../global/async.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";

export function archiveToObject(archive) {
    return archive.toObject();
}

export function checkSourceHasOfflineCopy(sourceID) {
    const source = getSharedArchiveManager().getSourceForID(sourceID);
    return source.checkOfflineCopy();
}

export function editGroup(groupID) {
    dispatch(setNewEntryParentGroup(groupID));
    const showEntryAdd = groupID !== "0";
    const showEditGroup = groupID !== "0";
    showArchiveContentsAddItemSheet(/* is root */ groupID === "0", showEntryAdd, showEditGroup);
}

export function lockSource(sourceID) {
    const archiveManager = getSharedArchiveManager();
    return archiveManager.getSourceForID(sourceID).lock();
}

export function unlockSource(sourceID, password) {
    const archiveManager = getSharedArchiveManager();
    return doAsyncWork().then(() => archiveManager.getSourceForID(sourceID).unlock(password));
}

export function updateCurrentArchive() {
    const state = getState();
    const archive = getSelectedArchive(state);
    dispatch(setGroups(archiveToObject(archive).groups));
}
