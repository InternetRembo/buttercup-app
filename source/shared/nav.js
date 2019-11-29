import { dispatch, getState } from "../store.js";
// import { isRoot } from "../selectors/nav.js";
import { NavigationActions, StackActions } from "react-navigation";

export const VAULT_CONTENTS_SCREEN = "VaultContents";
export const ENTRY_SCREEN = "Entry";
export const ENTRY_NEW_SCREEN = "EntryNew";
export const ENTRY_NEW_META_SCREEN = "EntryNewMeta";
export const ADD_VAULT_SCREEN = "AddVault";
export const REMOTE_CONNECT_SCREEN = "RemoteConnect";
export const REMOTE_EXPLORER_SCREEN = "RemoteExplorer";
export const LOCK_SCREEN = "Lock";
export const POPUP_BROWSER_SCREEN = "PopupBrowser";
export const ROOT_SCREEN = "Root";

let __lockPageShown = false;

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

export function backToRoot() {
    navigateToRoot();
}

export function hideLockPage() {
    if (__lockPageShown) {
        navigateBack();
        __lockPageShown = false;
    }
}

/**
 * Navigates back a page if not on main screen
 * @returns {Boolean} True if navigation possible, false otherwise
 */
export function navigateBackIfPossible() {
    const state = getState();
    if (isRoot(state) === false) {
        dispatch(navigateBack());
        return true;
    }
    return false;
}

export function showLockPage() {
    navigate(LOCK_SCREEN);
    __lockPageShown = true;
}

export const navigateBack = () => {
    _navigator.dispatch(NavigationActions.back());
};

export const navigateToRoot = () => {
    // navigate(ROOT_SCREEN);
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: ROOT_SCREEN })]
        })
    );
};

export const navigate = (routeName, params) => {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
            key: routeName + Math.random().toString()
        })
    );
};
