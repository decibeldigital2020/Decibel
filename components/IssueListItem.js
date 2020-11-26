import React from 'react';
import {
    Animated,
    Button,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-ionicons';
import IssueHero from './IssueHero';

const IssueListItem = ({ issue, navigation, selectIssue }) => {

    if (!issue) {
        return null;
    }

    const [accordionOpen, setAccordionOpen] = React.useState(false);
    const [bodySectionHeight, setBodySectionHeight] = React.useState(0);
    const [accordionLeftOffset, setAccordionLeftOffset] = React.useState(0);
    const animatedController = React.useRef(new Animated.Value(0)).current;

    const accordionHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bodySectionHeight + 12],
    });

    const toggleAccordion = ({newValue=false}) => {
        Animated.timing(animatedController, {
            duration: 300,
            toValue: (newValue || accordionOpen) ? 0 : 1,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false
        }).start();
        setAccordionOpen(newValue || !accordionOpen);
    };

    return <>
        <TouchableOpacity style={styles.issueListItem} onPress={toggleAccordion}>
            <View style={styles.issueNumberContainer}>
                <Text style={styles.issueNumber}>{ issue.issue_number.toString() }</Text>
            </View>
            <View style={styles.issueInfoContainer}>
                <Text style={styles.displayDate}>{ issue.display_date }</Text>
                <Text style={[styles.issueName, {color: accordionOpen ? styleConstants.selectedIssueNameColor : styleConstants.issueNameColor}]}>{ issue.issue_name }</Text>
            </View>
            <View style={styles.accordionIcon}>
                { !accordionOpen && <Icon name="arrow-down" color="#000" /> }
                { accordionOpen && <Icon name="arrow-up" color="#000" /> }
            </View>
        </TouchableOpacity>
        <Animated.View 
            style={[styles.accordionContainer, { height: accordionHeight, left: accordionLeftOffset }]}>
            <View 
                style={styles.accordion}
                onLayout={event => {
                    setBodySectionHeight(event.nativeEvent.layout.height);
                    setAccordionLeftOffset(event.nativeEvent.layout.width * .05);
                }
                }>
                <IssueHero uploadTimestamp={issue.upload_timestamp} visible={accordionOpen} />
                <View style={styles.accordionButton}>
                    <Button 
                        color={styleConstants.buttonColor}
                        title={"Preview Issue"}
                        onPress={() => {
                            selectIssue(issue.product_id);
                            navigation.navigate('PreviewIssue');
                        }}
                    />
                </View>
            </View>
        </Animated.View>
    </>;
}

const styleConstants = {
    buttonColor: "#FFF",
    selectedIssueNameColor: "#F00",
    issueNameColor: "#000"
}

const styles = StyleSheet.create({
    accordion: {
        backgroundColor: "#EEE",
        borderRadius: 6,
        flex: 1,
        flexDirection: "column",
        paddingTop: 12,
        paddingBottom: 12,
        bottom: 0,
        position: "absolute",
        width: "90%",
        marginTop: 6,
        marginBottom: 6
    },
    accordionButton: {
        marginVertical: 10,
        marginHorizontal: 24,
        borderRadius: 4,
        backgroundColor: "#555"
    },
    accordionContainer: {
        overflow: "hidden",
        flex: 1,
        flexDirection: "column",
    },
    accordionIcon: {
        color: "#000000",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 40
    },
    displayDate: {
        fontWeight: "300"
    },
    issueInfoContainer: {
        flex: 1,
        flexDirection: "column"
    },
    issueListItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        padding: 8,
        paddingLeft: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        marginVertical: 4,
        alignItems: "center"
    },
    issueName: {
        fontWeight: "500",
        fontSize: 18
    },
    issueNumberContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 40
    },
    issueNumber: {
    }
});

IssueListItem.defaultProps = {
    issue: null
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = () => dispatch => ({
    selectIssue: productId => dispatch({ type: "SELECT_ISSUE", payload: { productId }})
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueListItem);