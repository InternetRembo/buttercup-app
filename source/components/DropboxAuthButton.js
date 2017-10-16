import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";
import { Cell, CellGroup } from "react-native-cell-components";

class DropboxAuthButton extends Component {
    beginAuthentication() {
        this.props.onClick();
    }

    render() {
        const title = this.props.authenticated ? "Authenticated" : "Authenticate";
        return (
            <CellGroup>
                <Cell
                    title={title}
                    icon={{ name: "dropbox", source: "font-awesome" }}
                    onPress={() => this.beginAuthentication()}
                    tintColor="#1144FF"
                    disabled={this.props.authenticating || this.props.authenticated}
                />
            </CellGroup>
        );
    }
}

DropboxAuthButton.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default DropboxAuthButton;
