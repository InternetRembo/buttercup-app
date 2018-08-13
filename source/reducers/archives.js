import {
    ARCHIVES_SET,
    ARCHIVES_SET_TOUCHID_ENABLED,
    ARCHIVES_TOGGLE_IS_UNLOCKING,
    ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT
} from "../actions/types.js";
import { ArchiveSourceStatus } from "../library/buttercup.js";

const { LOCKED, UNLOCKED } = ArchiveSourceStatus;

const INITIAL = {
    archives: [],
    archivesUsingTouchID: [],
    showUnlockPasswordPrompt: false
};

export default function archivesReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ARCHIVES_SET:
            return {
                ...state,
                archives: [...action.payload]
            };
        case ARCHIVES_TOGGLE_UNLOCK_PASS_PROMPT:
            return {
                ...state,
                showUnlockPasswordPrompt: !!action.payload
            };
        case ARCHIVES_SET_TOUCHID_ENABLED:
            return {
                ...state,
                archivesUsingTouchID: [...action.payload]
            };

        default:
            return state;
    }
}
