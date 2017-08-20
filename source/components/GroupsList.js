import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from "react-native";
import PropTypes from "prop-types";
import { Button } from "react-native-elements";

const ACCORDION_ITEM_HEIGHT = 48;
const ENTRY_ICON = require("../../resources/images/entry-256.png");
const GROUP_ICON = require("../../resources/images/group-256.png");
const ADD_ICON = require("../../resources/images/add-256.png");
const IMAGE_SIZE = ACCORDION_ITEM_HEIGHT - 8;
// const ICON_SIZE = IMAGE_SIZE - 6;

const styles = StyleSheet.create({
    accordionHeaderView: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        height: ACCORDION_ITEM_HEIGHT,
        width: "100%"
    }
});

function renderItem(section) {
    const imageLeft = 5 + (20 * this.level);
    const textLeft = imageLeft + 8;
    const textStyle = {
        flex: 1,
        marginLeft: 8
    };
    const imageStyle = {
        flex: 0,
        marginLeft: imageLeft,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE
    };
    const touchable = typeof this.onPress === "function" || typeof section.onPress === "function";
    return (
        <TouchableHighlight
            disabled={!touchable}
            key={section.id}
            onPress={() => (this.onPress || section.onPress)(section.id, this.parentID)}
            underlayColor="white"
            >
                <View style={styles.accordionHeaderView} key={section.id}>
                    <Image
                        style={imageStyle}
                        source={section.icon}
                        />
                    <Text style={textStyle}>{section.title}</Text>
                </View>
        </TouchableHighlight>
    );
}

function renderSection(section) {
    const GroupsListContainer = require("../containers/GroupsList.js").default;
    return (
        <View style={{ width: "100%" }}>
            <GroupsListContainer
                groups={section.content.groups}
                entries={section.content.entries}
                level={this.level + 1}
                parentID={section.id}
                />
        </View>
    );
}

class GroupsList extends Component {

    getEntrySections() {
        return this.props.entries.map(entry => ({
            id: entry.id,
            title: entry.properties.title,
            content: entry,
            onPress: () => {},
            icon: ENTRY_ICON
        }));
    }

    getGroupSections() {
        return this.props.groups.map(group => ({
            id: group.id,
            title: group.title,
            content: group,
            icon: GROUP_ICON
        }));
    }

    getMiscSections() {
        return [
            {
                id: "button-add",
                title: "Add",
                content: null,
                onPress: (targetID, parentID) => {
                    this.props.onAddPressed(parentID);
                },
                icon: ADD_ICON
            }
        ];
    }

    render() {
        const { level } = this.props;
        const accordionStyles = { width: "100%" };
        if (level === 0) {
            accordionStyles.height = "100%";
        }
        const RootElement = (level === 0) ?
            ScrollView :
            View;
        return (
            <RootElement style={accordionStyles}>
                <View>
                    <Accordion
                        sections={this.getGroupSections()}
                        renderHeader={renderItem.bind({
                            level,
                            parentID: this.props.parentID
                        })}
                        renderContent={renderSection.bind({ level })}
                        underlayColor="white"
                        />
                    {this.getEntrySections().map(section => renderItem.call({
                        level,
                        onPress: id => this.props.loadEntry(id),
                        parentID: this.props.parentID
                    }, section))}
                    {this.getMiscSections().map(section => renderItem.call({
                        level,
                        parentID: this.props.parentID
                    }, section))}
                </View>
            </RootElement>
        );
    }

}

GroupsList.propTypes = {
    groups:             PropTypes.arrayOf(PropTypes.object).isRequired,
    level:              PropTypes.number.isRequired,
    loadEntry:          PropTypes.func.isRequired,
    onAddPressed:       PropTypes.func.isRequired,
    parentID:           PropTypes.string
};

GroupsList.defaultProps = {
    parentID:           "0"
};

export default GroupsList;
