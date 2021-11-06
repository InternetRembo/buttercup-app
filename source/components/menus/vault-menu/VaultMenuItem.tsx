import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import { VaultSourceStatus } from "buttercup";
import { VAULT_TYPES } from "../../../library/buttercup";
import { VaultDetails } from "../../../types";

interface VaultMenuItemProps {
    onActivate: () => void;
    vault: VaultDetails;
}

const INNER_BORDER_COLOUR = "color-basic-1100";

const themedStyles = StyleService.create({
    avatar: {
        marginBottom: 10
    },
    card: {
        width: "86%",
        maxWidth: 340,
        shadowColor: "color-basic-700", //BRAND_COLOUR, //"color-success-hover-border",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: "visible",

        borderWidth: 1,
        borderStyle: "solid",
        borderColor: INNER_BORDER_COLOUR,
        borderRadius: 4,
        backgroundColor: "background-basic-color-1",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        padding: 0
    },
    container: {
        width: "100%",
        // flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 28
    },
    smallContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // padding: 8,
        backgroundColor: "color-basic-700",
        borderLeftWidth: 1,
        borderLeftStyle: "solid",
        borderLeftColor: INNER_BORDER_COLOUR,
        minHeight: 90
    },
    smallContainerAbove: {
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: INNER_BORDER_COLOUR
    },
    smallContainers: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexGrow: 1,
        flexShrink: 1
    },
    smallHeading: {
        color: "color-basic-600"
    },
    smallSubtitle: {
        color: "color-basic-500"
    },
    statusContainer: {
        marginTop: 32,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    statusIcon: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    statusIconLocked: {
        color: "color-danger-active"
    },
    statusIconUnlocked: {
        color: "color-success-active"
    },
    tallContainer: {
        padding: 8,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 3,
        flexShrink: 0
    }
});

export function VaultMenuItem(props: VaultMenuItemProps) {
    const { onActivate, vault } = props;
    const {
        title: vaultTypeName,
        icon: vaultTypeIcon
    } = VAULT_TYPES[vault.type];
    const styles = useStyleSheet(themedStyles);
    const unlockedColour = (styles.statusIconUnlocked as any).color;
    const lockedColour = (styles.statusIconLocked as any).color;
    const handleTouchActivation = useCallback(() => {
        onActivate();
    }, [onActivate]);
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleTouchActivation} style={styles.card}>
                {/* <View style={styles.card}> */}
                    <View style={styles.tallContainer}>
                        <Avatar
                            size="giant"
                            source={vaultTypeIcon}
                            style={styles.avatar}
                        />
                        <Text category="h5">{vault.name}</Text>
                        <Text category="s2">{vaultTypeName}</Text>
                        <View style={styles.statusContainer}>
                            {vault.state === VaultSourceStatus.Unlocked && (
                                <>
                                    <Icon name="unlock" fill={unlockedColour} style={styles.statusIcon} />
                                    <Text category="c2">Unlocked</Text>
                                </>
                            )}
                            {vault.state === VaultSourceStatus.Locked && (
                                <>
                                    <Icon name="lock" fill={lockedColour} style={styles.statusIcon} />
                                    <Text category="c2">Locked</Text>
                                </>
                            )}
                        </View>
                    </View>
                    <View style={styles.smallContainers}>
                        <View style={[styles.smallContainer, styles.smallContainerAbove]}>
                            <Text category="h6" style={styles.smallHeading}>18</Text>
                            <Text category="c1" style={styles.smallSubtitle}>Entries</Text>
                        </View>
                        <View style={[styles.smallContainer, styles.smallContainerAbove]}>
                            <Text category="h6" style={styles.smallHeading}>8</Text>
                            <Text category="c1" style={styles.smallSubtitle}>Groups</Text>
                        </View>
                        <View style={styles.smallContainer}>
                            <Text category="h6" style={styles.smallHeading}>2</Text>
                            <Text category="c1" style={styles.smallSubtitle}>Attachments</Text>
                        </View>
                    </View>
                {/* </View> */}
            </TouchableOpacity>
        </View>
    );
}
