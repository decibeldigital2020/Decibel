import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-ionicons';
import { styleConstants } from '../constants/styles';

const BottomNavigation = ({navigation}) => {
    return <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Icon name="paper" color={styleConstants.iconLight.color} style={styles.icon} />
            <Text style={[styles.iconLabelText, styles.iconLabelTextHighlighted]}>Issues</Text>
        </View>
        <View style={styles.iconContainer}>
            <Icon name="cloud-download" color={styleConstants.iconMedium.color} style={styles.icon} />
            <Text style={styles.iconLabelText}>Downloads</Text>
        </View>
        <View style={styles.iconContainer}>
            <Icon name="help-circle" color={styleConstants.iconMedium.color} style={styles.icon} />
            <Text style={styles.iconLabelText}>Help</Text>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        minHeight: 62,
        maxHeight: 62,
        backgroundColor: "#000",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: "auto",
        marginRight: "auto"
    },
    iconContainer: {
        flex: 1,
        flexDirection: "column",
        maxWidth: 90,
        padding: 6
    },
    iconLabelText: {
        color: "#CCC",
        fontSize: 12,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 6
    },
    iconLabelTextHighlighted: {
        color: "#FFF"
    }
});

export default BottomNavigation;