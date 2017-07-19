import React from "react";
import { connect } from "react-redux";
import { Actions, Router, Scene } from "react-native-router-flux";
import ArchivesPage from "./components/ArchivesPage.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import RemoteConnectPage from "./containers/RemoteConnectPage.js";
import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";
import ArchiveContentsPage from "./containers/ArchiveContentsPage.js";
import AddMetaPage from "./containers/AddMetaPage.js";
import EntryPage from "./containers/EntryPage.js";
import { showNewPrompt } from "./actions/RemoteExplorerPage.js";
import { showArchivesPageRightSheet } from "./shared/sheets.js";

import { dispatch } from "./store.js";

const RouterWithRedux = connect()(Router);

export function getRouter() {
    return (
        <RouterWithRedux>
            <Scene key="root">
                <Scene
                    key="archives"
                    component={ArchivesPage}
                    initial={true}
                    hideNavBar={false}
                    title="Buttercup"
                    rightTitle="🔐"
                    onRight={showArchivesPageRightSheet}
                    leftTitle="⚙️"
                    onLeft={() => alert("Settings - WIP")}
                    />
                <Scene
                    key="addArchive"
                    component={AddArchivePage}
                    hideNavBar={false}
                    title="Add Archive"
                    />
                <Scene
                    key="remoteConnect"
                    component={RemoteConnectPage}
                    hideNavBar={false}
                    title="Remote Connection"
                    />
                <Scene
                    key="remoteExplorer"
                    component={RemoteExplorerPage}
                    hideNavBar={false}
                    rightTitle="New"
                    onRight={() => dispatch(showNewPrompt())}
                    title="Choose Archive"
                    />
                <Scene
                    key="archiveContents"
                    component={ArchiveContentsPage}
                    hideNavBar={false}
                    title=""
                    />
                <Scene
                    key="entry"
                    component={EntryPage}
                    hideNavBar={false}
                    title=""
                    />
                <Scene
                    key="addMeta"
                    component={AddMetaPage}
                    hideNavBar={false}
                    title="Add New Meta"
                    backTitle="Cancel"
                    rightTitle="Add"
                    onRight={() => alert("Save")}
                    />
            </Scene>
        </RouterWithRedux>
    );
}
