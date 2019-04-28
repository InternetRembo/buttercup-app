import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Cell, CellGroup } from "react-native-cell-components";
import PropTypes from "prop-types";
import i18next from "i18next";
import { withNamespaces } from "react-i18next";
import { getArchiveTypeDetails } from "../library/archives.js";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        width: 32,
        height: 32
    }
});

const ARCHIVE_TYPES = getArchiveTypeDetails();

class AddArchive extends Component {
    static navigationOptions = {
        title: i18next.t("archives.add-archive")
    };

    getMenuContents() {
        return (
            <CellGroup header={this.props.t("remote.self")}>
                {ARCHIVE_TYPES.map(({ type, title, image }) => (
                    <Cell
                        key={type}
                        icon={() => <Image source={image} style={styles.icon} />}
                        onPress={() => this.handleTypeSelected(type, title)}
                    >
                        <Text>{title}</Text>
                    </Cell>
                ))}
            </CellGroup>
        );
    }

    handleTypeSelected(type, title) {
        this.props.onArchiveSelected(type, title);
    }

    render() {
        return <ScrollView style={styles.container}>{this.getMenuContents()}</ScrollView>;
    }
}

AddArchive.propTypes = {
    onArchiveSelected: PropTypes.func.isRequired,
    stage: PropTypes.string.isRequired
};

AddArchive.defaultProps = {
    stage: "chooseType"
};

export default withNamespaces()(AddArchive);
