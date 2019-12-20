import React, { Component } from "react";
import { Button, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Cell, CellGroup, CellInput } from "@sallar/react-native-cell-components";
import { FIELD_VALUE_TYPE_TEXT } from "@buttercup/facades";
import { saveEntryProperty } from "../shared/entry.js";
import { FIELD_TYPE_OPTIONS } from "../library/buttercup.js";

const CELL_OPTIONS = {
    autoCapitalize: "none",
    autoCorrect: false,
    keyboardType: "default",
    spellCheck: false
};

const styles = StyleSheet.create({
    container: {
        width: "100%"
    }
});

class EditPropertyPage extends Component {
    static navigationOptions = {
        title: "Edit Property",
        headerRight: <Button title="Save" onPress={saveEntryProperty} />
    };

    static propTypes = {
        fieldData: PropTypes.object.isRequired,
        onUnmount: PropTypes.func.isRequired
    };

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const currentTypeField = FIELD_TYPE_OPTIONS.find(
            fieldOption =>
                (!this.props.fieldData.newValueType &&
                    fieldOption.type === FIELD_VALUE_TYPE_TEXT) ||
                fieldOption.type === this.props.fieldData.newValueType
        );
        return (
            <View style={styles.container}>
                <CellGroup>
                    <CellInput
                        key="key"
                        title="Name"
                        value={this.props.fieldData.newProperty}
                        onChangeText={text => this.props.onEditProperty(text)}
                        {...CELL_OPTIONS}
                    />
                    <CellInput
                        key="value"
                        title="Value"
                        value={this.props.fieldData.newValue}
                        onChangeText={text => this.props.onEditValue(text)}
                        {...CELL_OPTIONS}
                    />
                </CellGroup>
                <CellGroup>
                    <Cell
                        key="valueType"
                        title="Type"
                        value={currentTypeField.title}
                        icon={{ name: "planet", source: "ionicons" }}
                        onPress={() => this.props.onChooseValueType()}
                    />
                </CellGroup>
            </View>
        );
    }
}

export default EditPropertyPage;
