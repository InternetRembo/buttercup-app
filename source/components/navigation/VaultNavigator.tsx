import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    BottomNavigation,
    BottomNavigationTab,
    Icon,
    Layout,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import { GroupID } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { CURRENT_SOURCE } from "../../state/vault";
import { createNewGroup } from "../../services/buttercup";
import { setBusyState } from "../../services/busyState";
import { notifyError, notifySuccess } from "../../library/notifications";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { CodesScreen } from "../screens/CodesScreen";
import { VaultSettingsScreen } from "../screens/VaultSettingsScreen";
import { TextPrompt } from "../prompts/TextPrompt";
import { VaultContentsMenu } from "../menus/VaultContentsMenu";

const { Navigator, Screen } = createBottomTabNavigator();

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const CodesIcon = props => <Icon {...props} name="checkmark-circle-outline" />;
const FolderIcon = props => <Icon {...props} name="folder-outline" />;
const SearchIcon = props => <Icon {...props} name="search-outline" />;
const SettingsIcon = props => <Icon {...props} name="settings-outline" />;
const WalletIcon = props => <Icon {...props} name="credit-card-outline" />;

const SearchScreen = () => (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="h1">SEARCH</Text>
    </Layout>
);

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}
    >
        <BottomNavigationTab title="SEARCH" icon={SearchIcon} />
        <BottomNavigationTab title="GROUPS" icon={FolderIcon} />
        <BottomNavigationTab title="WALLET" icon={WalletIcon} />
        <BottomNavigationTab title="CODES" icon={CodesIcon} />
        <BottomNavigationTab title="SETTINGS" icon={SettingsIcon} />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name="Search" component={SearchScreen} />
        <Screen name="Groups" component={VaultContentsScreen} />
        <Screen name="Wallet" component={WalletScreen} />
        <Screen name="Codes" component={CodesScreen} />
        <Screen name="Settings" component={VaultSettingsScreen} />
    </Navigator>
);

export function VaultNavigator({ navigation }) {
    const [promptGroupCreate, setPromptGroupCreate] = useState(false);
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const handleGroupCreate = useCallback(async (groupName: string) => {
        setBusyState("Creating group");
        setPromptGroupCreate(false);
        let newGroupID: GroupID;
        try {
            newGroupID = await createNewGroup(currentSourceState.get(), groupName);
            notifySuccess("Group created", `Group was successfully created: ${groupName}`);
        } catch (err) {
            console.error(err);
            notifyError("Failed creating group", err.message);
        } finally {
            setBusyState(null);
        }
        if (newGroupID) {
            navigation.push(
                "VaultContents",
                {
                    groupID: newGroupID
                }
            );
        }
    }, [currentSourceState]);
    const navigateBack = () => {
        navigation.goBack();
    };
    const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <TopNavigation
                    title="Vault"
                    alignment="center"
                    accessoryLeft={BackAction}
                    accessoryRight={() => (
                        <VaultContentsMenu
                            onGroupCreate={() => setPromptGroupCreate(true)}
                        />
                    )}
                />
                <TabNavigator />
            </SafeAreaView>
            <TextPrompt
                cancelable
                onCancel={() => setPromptGroupCreate(false)}
                onSubmit={handleGroupCreate}
                prompt="New group title"
                submitText="Create"
                visible={promptGroupCreate}
            />
        </>
    );
}
