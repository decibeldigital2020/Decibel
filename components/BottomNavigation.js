import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { styleConstants } from '../constants/styles';

const getIconColor = (active) => active ? styleConstants.iconLight.color : styleConstants.iconMedium.color;
const getLabelStyles = (active) => active ? [styles.iconLabelText, styles.iconLabelTextHighlighted] : styles.iconLabelText;

const BottomNavigation = ({navigation}) => {
    console.log(navigation);
    return null;
    return <View style={styles.container}>
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("IssueList");
            }}
            style={styles.iconContainer}>
            <Icon name="paper" color={getIconColor(true)} style={styles.icon} />
            <Text style={getLabelStyles(true)}>Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Downloads");
            }}
            style={styles.iconContainer}>
            <Icon name="cloud-download" color={getIconColor(false)} style={styles.icon} />
            <Text style={getLabelStyles(false)}>Downloads</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Library");
            }}
            style={styles.iconContainer}>
            <Icon name="paper" color={getIconColor(false)} style={styles.icon} />
            <Text style={getLabelStyles(false)}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("Help");
            }}
            style={styles.iconContainer}>
            <Icon name="help-circle" color={getIconColor(false)} style={styles.icon} />
            <Text style={getLabelStyles(false)}>Help</Text>
        </TouchableOpacity>
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