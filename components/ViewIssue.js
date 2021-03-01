import React from 'react';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import {
    cancelIssueDownload as cancelIssueDownloadAction
} from '../actions/issueRetrievalActions';
import {
    getStatusFromProgressMap,
    getIssueFilenames,
} from '../util/issueRetrievalUtil';
import { FILE_RETRIEVAL_STATUS, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';
import LogoTitle from './LogoTitle';
import ImageListViewer from './ImageListViewer';
import ImageListZoomViewer from './ImageListZoomViewer';

const MiddleSpinner = () => 
    <View style={styles.container}>
        <View style={styles.requested}>
            <View style={styles.logoTitle}>
                <LogoTitle style={styles.logoTitleImage} />
            </View>
            <ActivityIndicator size={"large"} color={styles.activityIndicator.color} style={styles.requestedActivityIndicator} />
        </View>
    </View>;

const ViewIssue = ({
    canceledIssues,
    cancelIssueDownload,
    downloadProgressMap,
    fileCacheMap, 
    navigation,
    resetSelectedIssue,
    resourceType, 
    selectedIssue
}) => {

    const goBack = () => {
        navigation && navigation.navigate && navigation.navigate('RootTabNavigator');
    }

    if (!selectedIssue || !fileCacheMap) {
        return null;
    }

    let resourceName = selectedIssue.upload_timestamp;
    let totalPages = selectedIssue.total_pages;

    const thisIssueIsCancelled = (canceledIssues) => 
        canceledIssues
            .findIndex(i => 
                i.resourceName === resourceName 
                && i.resourceType === resourceType) !== -1;

    const statusFromProgressMap = getStatusFromProgressMap(selectedIssue.upload_timestamp, resourceType, downloadProgressMap);
    const issueDownloadStatus = statusFromProgressMap.status;
    const issueDownloadProgress = statusFromProgressMap.progress;

    React.useEffect(() => {
        if (!selectedIssue || !fileCacheMap || thisIssueIsCancelled(canceledIssues)) {
            // console.log("canceled. go back", canceledIssues, navigation);
            goBack();
        }
        return () => {};
    }, [selectedIssue, fileCacheMap, canceledIssues]);

    if (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED 
        || thisIssueIsCancelled(canceledIssues)) {
        // console.log("detected cancellation");
        return null;
    }

    const handleCancelIssueDownloadClick = () => 
        cancelIssueDownload(resourceName, totalPages, resourceType);

    return <View style={styles.container}>
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <ImageListZoomViewer
                navigation={navigation}
                resourceName={resourceName}
                resourceType={resourceType} />
        }
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.REQUESTED &&
            <View style={styles.requested}>
                <View style={styles.logoTitle}>
                    <LogoTitle style={styles.logoTitleImage} />
                </View>
                <ActivityIndicator size={"large"} color={styles.activityIndicator.color} style={styles.requestedActivityIndicator} />
            </View>
        }
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
            <View style={styles.inProgress}>
                <View style={styles.logoTitle}>
                    <LogoTitle style={styles.logoTitleImage} />
                </View>
                <Text style={styles.issueTitle}>{ selectedIssue.display_date + " - " + selectedIssue.issue_name }</Text>
                <View style={styles.progressInfo}>
                    <Text style={styles.inProgressText}>Downloading ({Math.floor(issueDownloadProgress*100)}%)...</Text>
                    <ProgressView
                        progressTintColor={styles.progressTintColor.color}
                        trackTintColor={styles.trackTintColor.color}
                        progress={issueDownloadProgress}
                    />
                </View>
                <Button
                    color={styleConstants.actionButton.color}
                    onPress={handleCancelIssueDownloadClick}
                    style={styles.cancelDownloadButton}
                    title={"Cancel download"}
                />
                <Button
                    color={styleConstants.passiveButton.color}
                    onPress={goBack}
                    style={styles.goBackButton}
                    title={"Continue in background"}
                />
            </View>
        }
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.FAILED &&
            <View style={styles.errorTextContainer}>
                <Text style={styles.errorText}>There was a problem fetching the file.</Text>
                <Button
                    color={styleConstants.passiveButton.color}
                    onPress={handleCancelIssueDownloadClick}
                    style={styles.goBackButton}
                    title={"Go Back"}
                />
                <ErrorHelperText />
            </View>
        }
    </View>;
};

const styles = StyleSheet.create({
    activityIndicator: {
        color: "#DDD"
    },
    cancelDownloadButton: {
        marginTop: 12
    },
    container: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#000"
    },
    errorTextContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    errorText: {
        color: "#DDD",
        textAlign: "center",
        padding: 12
    },
    goBackButton: {
    },
    inProgress: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around"
    },
    inProgressText: {
        color: "#DDD",
        justifyContent: "center",
        paddingBottom: 12,
        marginLeft: "auto",
        marginRight: "auto",
        fontWeight: "500",
        fontSize: 20
    },
    issueTitle: {
        fontWeight: "500",
        fontSize: 24,
        marginBottom: 12,
        color: "#FFF",
        marginLeft: "auto",
        marginRight: "auto"
    },
    logoTitle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 50,
        marginTop: 50
    },
    logoTitleImage: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    progressInfo: {
        maxWidth: 250,
        flex: 1,
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto"
    },
    progressTintColor: {
        color: "#DDD"
    },
    requested: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    requestedActivityIndicator: {
        marginBottom: 10
    },
    trackTintColor: { 
        color: "#444"
    }
})

const mapStateToProps = state => ({
    canceledIssues: state.canceledIssues,
    downloadProgressMap: state.downloadProgressMap,
    fileCacheMap: state.fileCacheMap,
    selectedIssue: state.selectedIssue
});

const mapDispatchToProps = dispatch => ({
    cancelIssueDownload: (resourceName, totalPages, resourceType) => 
        dispatch(cancelIssueDownloadAction(resourceName, totalPages, resourceType)),
    resetSelectedIssue: () => dispatch({ type: "SELECT_ISSUE", payload: {} })
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIssue);