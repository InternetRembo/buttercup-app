import React, { Component } from "react";
import { Provider } from "react-redux";
import { getRouter } from "./source/routing.js";
import { patchKeyDerivation } from "./source/library/buttercup.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";

import store from "./source/store.js";

export default class ButtercupShared extends Component {

    constructor(...args) {
        super(...args);
        // Setup native key derivation immediately
        patchKeyDerivation();
        // Initialise the manager
        getSharedArchiveManager().rehydrate();
    }

    render() {
        return (
            <Provider store={store}>
                {getRouter()}
            </Provider>
        );
    }

}
