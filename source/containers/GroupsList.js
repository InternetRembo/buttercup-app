import { connect } from "react-redux";
import GroupsList from "../components/GroupsList.js";
import { getGroupsUnderID, getSelectedSourceID } from "../selectors/ArchiveContentsPage.js";
import { getEntryTitle, loadEntry } from "../shared/entry.js";
import { showArchiveContentsAddItemSheet } from "../shared/sheets.js";
import { setNewEntryParentGroup } from "../actions/entry.js";
import { navigateToEntry } from "../actions/navigation.js";

function loadAndOpenEntry(entryID, dispatch, getState) {
    const state = getState();
    const sourceID = getSelectedSourceID(state);
    const entryTitle = getEntryTitle(sourceID, entryID);
    loadEntry(sourceID, entryID);
    dispatch(navigateToEntry({ title: entryTitle }));
}

export default connect(
    (state, ownProps) => ({
        entries:                ownProps.entries || [],
        groups:                 ownProps.groups || getGroupsUnderID(state, ownProps.groupID),
        isTrash:                ownProps.isTrash,
        level:                  ownProps.level || 0,
        parentID:               ownProps.parentID || "0"
    }),
    {
        loadEntry:              (entryID) => (dispatch, getState) => loadAndOpenEntry(entryID, dispatch, getState),
        onAddPressed:           (parentGroupID) => (dispatch) => {
            dispatch(setNewEntryParentGroup(parentGroupID));
            const showEntryAdd = parentGroupID !== "0";
            showArchiveContentsAddItemSheet(showEntryAdd);
        }
    }
)(GroupsList);
