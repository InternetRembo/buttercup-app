import React from "react";
import { View, StyleSheet, Dimensions, Button, Text, TouchableOpacity } from "react-native";
import { navigateBack } from "../shared/nav";
import QRCodeScanner from "react-native-qrcode-scanner";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    zeroContainer: {
        height: 0,
        flex: 0
    },
    cameraContainer: {
        height: Dimensions.get("window").width + 200
    },
    centerText: {
        fontSize: 18,
        padding: 32,
        color: "#777",
        textAlign: "center"
    },
    textBold: {
        fontWeight: "500",
        color: "#000"
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)"
    },
    buttonTouchable: {
        padding: 16
    }
});

const QRCodeScannerPage = () => {
    const onSuccess = e => {
        console.log(e);
    };
    return (
        <View style={styles.container}>
            <QRCodeScanner
                topViewStyle={styles.zeroContainer}
                cameraStyle={styles.cameraContainer}
                bottomContent={
                    <Text style={styles.centerText}>
                        Point your camera at a <Text style={styles.textBold}>QR Code</Text> to add
                        it to your vault.
                    </Text>
                }
                onRead={onSuccess}
            />
        </View>
    );
};

QRCodeScannerPage.navigationOptions = ({ navigation }) => ({
    title: "Scan QR Code",
    headerRight: () => <Button color="#454545" onPress={() => navigateBack()} title="Dismiss" />
});

export default QRCodeScannerPage;
