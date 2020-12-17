import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { DECIBEL_HELP_URL } from '../constants';

const ErrorHelperText = ({}) => {
    return <View style={styles.container}>
        <Text 
            onPress={() => Linking.openURL(DECIBEL_HELP_URL)}
            style={styles.errorHelperText}>
            { DECIBEL_HELP_URL }
        </Text>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        margin: 12
    },
    errorHelperText: {
        fontWeight: "400",
        fontSize: 18,
        color: "#99F"
    }
});

export default ErrorHelperText;