import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import ErrorHelperText from './ErrorHelperText';
import RestorePurchasesButton from './RestorePurchasesButton';

const Help = ({}) => {
    return <View style={styles.container}>
        <Text style={styles.headerText}>Help</Text>
        <Text style={styles.bodyText}>
            If you have previously purchased issues on another device or you have an active subscription and are unable to view the issues, you can try restoring your purchases by tapping the button below.
        </Text>
        <RestorePurchasesButton />
        <Text style={styles.bodyText}>
            If you need help from Decibel, tap the link below to contact us.
        </Text>
        <ErrorHelperText />
    </View>;
}

const styles = StyleSheet.create({
    bodyText: {
        color: "#FFF",
        fontWeight: "400",
        fontSize: 18,
        margin: 16
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "#000"
    },
    headerText: {
        fontWeight: "800",
        fontSize: 24,
        marginBottom: 12,
        marginTop: 12,
        color: "#FFF",
        marginLeft: "auto",
        marginRight: "auto"
    },
});

export default Help;