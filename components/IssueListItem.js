import React from 'react';
import {
    ActivityIndicator,
    Animated,
    Button,
    Easing,
    Modal,
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
import { 
    getIssue as getIssueAction,
    removeIssue as removeIssueAction 
} from '../actions/issueRetrievalActions';
import {
    getStatusFromProgressMap
} from '../util/issueRetrievalUtil';
import { requestNewPurchase as requestNewPurchaseAction } from '../actions/iapActions';

const IssueListItem = ({ 
    canceledIssues,
    controlAccordion, 
    downloaded, 
    downloadProgressMap,
    fileCacheMap, 
    getIssue,
    issue, 
    owned, 
    navigation, 
    product,
    requestNewPurchase,
    removeIssue, 
    selectIssue 
}) => {

    if (!issue) {
        return null;
    }

    const [accordionOpen, setAccordionOpen] = React.useState(controlAccordion || false);
    const [bodySectionHeight, setBodySectionHeight] = React.useState(0);
    const animatedController = React.useRef(new Animated.Value(controlAccordion ? 1 : 0)).current;
    const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = React.useState(false);

    const statusFromProgressMap = getStatusFromProgressMap(issue.upload_timestamp, RESOURCE_TYPE.ISSUE_IMG, downloadProgressMap);
    const issueDownloadStatus = statusFromProgressMap.status;
    const issueDownloadProgress = statusFromProgressMap.progress;

    const accordionHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, bodySectionHeight],
    });

    const getPrice = () => 
        product 
            ? product.localizedPrice
            : "";

    const toggleAccordion = () => {
        let newValue = !accordionOpen;
        Animated.timing(animatedController, {
            duration: ACCORDION_DURATION,
            toValue: (accordionOpen) ? 0 : 1,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false
        }).start();
        setAccordionOpen(newValue);
    };

    const goToIssue = ({resourceType = null}) => {
        selectIssue(issue.product_id);
        navigation 
            && navigation.navigate 
            && navigation.navigate(resourceType === RESOURCE_TYPE.PREVIEW_IMG 
                ? 'PreviewIssue'
                : 'ViewIssue');
    };

    let resourceName = issue.upload_timestamp;
    let totalPages = issue.total_pages;

    return <View style={styles.issueListItemContainer}>
        <TouchableOpacity style={styles.issueListItem} onPress={toggleAccordion}>
            <View style={styles.issueNumberContainer}>
                { !!issue.issue_number && 
                    <Text style={styles.issueNumber}>{ issue.issue_number.toString() }</Text>
                }
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
                onLayout={event => setBodySectionHeight(event.nativeEvent.layout.height) }>
                <IssueHero 
                    resourceName={issue.upload_timestamp} 
                    style={styles.issueHero}
                    visible={accordionOpen} 
                />
                <View style={styles.issueDetailsContainer}>
                    { !owned &&
                        <View style={styles.actionButton}>
                            <Button
                                color={styleConstants.button.color}
                                title={"Buy " + getPrice()}
                                onPress={() => {
                                    requestNewPurchase(issue.sku);
                                }}
                            />
                        </View>
                    }
                    { !!owned && (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED) && 
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Download Issue"}
                                onPress={() => {
                                    getIssue(issue);
                                }}
                            />
                        </View>
                    }
                    { !!owned && (issueDownloadStatus === FILE_RETRIEVAL_STATUS.FAILED) && 
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Failed - Retry?"}
                                onPress={() => {
                                    getIssue(issue);
                                }}
                            />
                        </View>
                    }
                    { !!owned && issueDownloadStatus === FILE_RETRIEVAL_STATUS.REQUESTED &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                disabled={true}
                                title={"Requesting Issue..."}
                            />
                            <ActivityIndicator size={"small"} color={styleConstants.activityIndicator.color} />
                        </View>
                    }
                    { !!owned && issueDownloadStatus === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Downloading... (" + Math.floor(issueDownloadProgress*100) + "%)"}
                                onPress={goToIssue}
                            />
                        </View>
                    }
                    { !!owned && issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
                        <View style={styles.actionButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"View Issue"}
                                onPress={goToIssue}
                            />
                        </View>
                    }
                    { !downloaded && 
                        <View style={styles.previewIssueButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Preview Issue"}
                                onPress={() => {
                                    getIssue(issue, RESOURCE_TYPE.PREVIEW_IMG);
                                    goToIssue({ resourceType: RESOURCE_TYPE.PREVIEW_IMG });
                                }}
                            />
                        </View>
                    }
                    { !downloaded &&
                        <View style={styles.issueDescription}>
                            <Text>{issue.description}</Text>
                        </View>
                    }
                    { !!downloaded && issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
                        <View style={styles.passiveButton}>
                            <Button 
                                color={styleConstants.button.color}
                                title={"Delete Issue"}
                                onPress={() => {
                                    setDeleteConfirmationModalOpen(true);
                                }}
                            />
                        </View>
                    }
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={deleteConfirmationModalOpen}
                        onRequestClose={() => {}}>
                        <View style={styles.modal}>
                            <Text style={styles.modalText}>
                                Are you sure you want to delete {issue.display_date + " - " + issue.issue_name}?
                            </Text>
                            <View style={styles.modalButtonGroup}>
                                <View style={styles.actionButton}>
                                    <Button
                                        color={styleConstants.button.color}
                                        title={"Yes, Delete Issue"}
                                        onPress={() => {
                                            removeIssue(issue.upload_timestamp, issue.total_pages);
                                        }} 
                                    />
                                </View>
                                <View style={styles.passiveButton}>
                                    <Button
                                        color={styleConstants.button.color}
                                        title={"No, Keep Issue"}
                                        onPress={() => {
                                            setDeleteConfirmationModalOpen(false);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </Animated.View>
    </View>;
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: "#000"
    },
    modalText: {
        flex: 1,
        fontWeight: "500",
        fontSize: 20,
        color: "#FFF",
        flexDirection: "column",
        justifyContent: "center",
        maxHeight: 100,
        width: "90%"
    },
    modalButtonGroup: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        maxHeight: 100,
        width: "90%"
    },
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
    passiveButton: {
        backgroundColor: styleConstants.passiveButton.color,
        marginHorizontal: 6,
        borderRadius: 6,
        marginBottom: 4,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 40
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
    owned: false,
    issue: null
}

const mapStateToProps = (state) => ({
    canceledIssues: state.canceledIssues,
    downloadProgressMap: state.downloadProgressMap,
    fileCacheMap: state.fileCacheMap
});

const mapDispatchToProps = () => dispatch => ({
    getIssue: (issue, resourceType) => dispatch(getIssueAction(issue, resourceType)),
    removeIssue: (resourceName, totalPages) => dispatch(removeIssueAction(resourceName, totalPages)),
    requestNewPurchase: (sku) => dispatch(requestNewPurchaseAction(sku)),
    selectIssue: (productId) => dispatch({ type: "SELECT_ISSUE", payload: { productId }})
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueListItem);