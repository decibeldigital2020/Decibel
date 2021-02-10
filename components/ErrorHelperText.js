import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { DECIBEL_HELP_URL } from '../constants';

const ErrorHelperText = ({}) => {
    return <View style={styles.container}>
        <Text style={styles.errorHelperText}>To contact us for help, please visit: </Text>
        <Text 
            onPress={() => Linking.openURL(DECIBEL_HELP_URL)}
            style={styles.errorHelperLink}>
            { DECIBEL_HELP_URL }
        </Text>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: 12,
        maxHeight: 100
    },
    errorHelperLink: {
        textAlign: 'center',
        fontWeight: "400",
        fontSize: 18,
        color: "#99F"
    },
    errorHelperText: {
        textAlign: 'center',
        fontWeight: "400",
        fontSize: 18,
        color: "#FFF"
    }
});

export default ErrorHelperText;