import React from "react";
import { AppRegistry } from "react-native";
import ButtercupShared from "./index.shared.js";

export default class Buttercup extends ButtercupShared {
    constructor(...args) {
        super(...args);
        // Android specific launch code
    }
}

AppRegistry.registerComponent("Buttercup", () => Buttercup);
