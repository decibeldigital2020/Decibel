import React from 'react';
import {
    ActivityIndicator,
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
import { 
    ACCORDION_DURATION, 
    FILE_RETRIEVAL_STATUS,
    ISSUE_LIST_DESCRIPTION_LENGTH, 
    RESOURCE_TYPE 
} from "../constants";
import { styleConstants } from '../constants/styles';
import { getResource as getResourceAction } from '../actions/fileRetrievalActions';
import { getIssueFilename } from '../util/fileRetrievalUtil';

const IssueListItem = ({ controlAccordion, fileCacheMap, getResource, issue, navigation, selectIssue }) => {

    if (!issue) {
        return null;
    }

    const [accordionOpen, setAccordionOpen] = React.useState(controlAccordion || false);
    const [bodySectionHeight, setBodySectionHeight] = React.useState(0);
    const animatedController = React.useRef(new Animated.Value(!!controlAccordion ? 1 : 0)).current;

    const accordionHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bodySectionHeight],
    });

    React.useEffect(() => {
        if (accordionOpen !== controlAccordion && typeof controlAccordion === "boolean") {
            toggleAccordion(controlAccordion);
        }
    }, [controlAccordion]);

    const toggleAccordion = ({newValue=false}) => {
        Animated.timing(animatedController, {
            duration: ACCORDION_DURATION,
            toValue: (newValue || accordionOpen) ? 0 : 1,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false
        }).start();
        setAccordionOpen(newValue || !accordionOpen);
    };

    const filename = getIssueFilename(issue.upload_timestamp);

    return <View style={styles.issueListItemContainer}>
        <TouchableOpacity style={styles.issueListItem} onPress={toggleAccordion}>
            <View style={styles.issueNumberContainer}>
                <Text style={styles.issueNumber}>{ issue.issue_number.toString() }</Text>
            </View>
            <View style={styles.issueTitleContainer}>
                <Text style={styles.displayDate}>{ issue.display_date }</Text>
                <Text style={[styles.issueName, {color: accordionOpen ? styleConstants.selectedIssueName.color : styleConstants.issueName.color}]}>{ issue.issue_name }</Text>
            </View>
            <View style={styles.openAccordionIcon}>
                { !accordionOpen && <Icon name="arrow-down" color={styleConstants.icon.color} /> }
                { accordionOpen && <Icon name="arrow-up" color={styleConstants.icon.color} /> }
            </View>
        </TouchableOpacity>
        <Animated.View 
            style={[styles.accordionContainer, { height: accordionHeight }]}>
            <View 
                style={styles.accordion}
                onLayout={event => {
                    setBodySectionHeight(event.nativeEvent.layout.height);
                }
                }>
                <IssueHero 
                    uploadTimestamp={issue.upload_timestamp} 
                    style={styles.issueHero}
                    visible={accordionOpen} 
                />
                <View style={styles.issueDetailsContainer}>
                    { (!fileCacheMap[filename] || fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.FAILED) && 
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Download Issue"}
                                onPress={() => {
                                    getResource(issue.upload_timestamp, RESOURCE_TYPE.ISSUE);
                                }}
                            />
                        </View>
                    }
                    { fileCacheMap[filename] && fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                disabled={true}
                                title={"Requesting Issue..."}
                            />
                            <ActivityIndicator size={"small"} color={styleConstants.activityIndicator.color} />
                        </View>
                    }
                    { fileCacheMap[filename] && fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Downloading (" + Math.floor(fileCacheMap[filename].progress*100) + "%)"}
                                onPress={() => {
                                    selectIssue(issue.product_id);
                                    navigation.navigate('ViewIssue');
                                }}
                            />
                        </View>
                    }
                    { fileCacheMap[filename] && fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"View Issue"}
                                onPress={() => {
                                    selectIssue(issue.product_id);
                                    navigation.navigate('ViewIssue');
                                }}
                            />
                        </View>
                    }
                    <View style={styles.previewIssueButton}>
                        <Button 
                            color={styleConstants.button.color}
                            title={"Preview Issue"}
                            onPress={() => {
                                selectIssue(issue.product_id);
                                navigation.navigate('PreviewIssue');
                            }}
                        />
                    </View>
                    <View style={styles.issueDescription}>
                        <Text>{issue.description.slice(0, ISSUE_LIST_DESCRIPTION_LENGTH) + "..."}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    </View>;
}

const styles = StyleSheet.create({
    accordion: {
        backgroundColor: "#EEE",
        borderRadius: 6,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 4,
        paddingLeft: 4,
        bottom: 0,
        position: "absolute",
        width: "100%"
    },
    accordionContainer: {
        overflow: "hidden",
        flex: 1,
        flexDirection: "column"
    },
    actionButton: {
        backgroundColor: styleConstants.actionButton.color,
        marginHorizontal: 6,
        borderRadius: 6,
        marginBottom: 4,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 40
    },
    openAccordionIcon: {
        color: "#000000",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 40
    },
    displayDate: {
        fontWeight: "300"
    },
    issueDescription: {
        padding: 6
    },
    issueDetailsContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    issueHero: {
    },
    issueTitleContainer: {
        flex: 1,
        flexDirection: "column"
    },
    issueListItemContainer: {
        backgroundColor: "#EEE",
        marginVertical: 4,
        borderRadius: 5,
    },
    issueListItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        padding: 8,
        paddingLeft: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
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
    },
    previewIssueButton: {
        backgroundColor: "#444",
        marginHorizontal: 6,
        borderRadius: 6,
        marginBottom: 4,
    }
});

IssueListItem.defaultProps = {
    issue: null
}

const mapStateToProps = (state) => ({
    fileCacheMap: state.fileCacheMap
});

const mapDispatchToProps = () => dispatch => ({
    getResource: (uploadTimestamp, resourceType, page) => dispatch(getResourceAction(uploadTimestamp, resourceType, page)),
    selectIssue: productId => dispatch({ type: "SELECT_ISSUE", payload: { productId }})
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueListItem);