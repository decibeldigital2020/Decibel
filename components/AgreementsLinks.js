import React from 'react';
import {
    Linking,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    TERMS_OF_SERVICE_URL,
    PRIVACY_POLICY_URL
} from '../constants';
import { styleConstants } from '../constants/styles';

const AgreementsLinks = () => {
    return <View style={styles.linksList}>
            <Text
                onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}
                style={styles.link}>
                Terms of Use
            </Text>
            <Text
                onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
                style={styles.link}>
                Privacy Policy
            </Text>
        </View>;
}

const styles = StyleSheet.create({
    linksList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        maxHeight: 70
    },
    link: {
        color: styleConstants.link.color,
        maxHeight: 35,
        textAlign: "center",
        marginBottom: 10
    }
})

export default AgreementsLinks;