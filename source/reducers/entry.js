import {
    ENTRY_LOAD,
    ENTRY_NEW_META_CLEAR,
    ENTRY_NEW_META_SET,
    ENTRY_NOTIFICATION_SET,
    ENTRY_UNLOAD
} from "../actions/types.js";
import { ActionConst } from "react-native-router-flux";

const INITIAL = {
    editing: false,
    id: null,
    newMeta: {
        key: "",
        value: ""
    },
    properties: {},
    meta: {},
    sourceID: null,
    notification: ""
};

export default function entryReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case ENTRY_LOAD:
            const entryData = action.payload;
            return {
                ...state,
                id: entryData.id,
                properties: entryData.fields.filter(f => f.field === "property"),
                meta: entryData.fields.filter(f => f.field === "meta"),
                sourceID: entryData.sourceID
            };
        case ENTRY_UNLOAD:
            return {
                ...INITIAL
            };
        case ENTRY_NOTIFICATION_SET:
            return {
                ...state,
                notification: action.payload
            };
        case ActionConst.BACK_ACTION:
            /* falls-through */
        case ENTRY_NEW_META_CLEAR:
            return {
                ...state,
                newMeta: INITIAL.newMeta
            };
        case ENTRY_NEW_META_SET:
            return {
                ...state,
                newMeta: {
                    key: action.payload.key,
                    value: action.payload.value
                }
            };

        default:
            return state;
    }
}
