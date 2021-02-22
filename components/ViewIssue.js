import React from 'react';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import {
    cancelIssueDownload as cancelIssueDownloadAction,
    cancelIssuePreviewDownload as cancelIssuePreviewDownloadAction,
    getIssuePreview as getIssuePreviewAction
} from '../actions/issueRetrievalActions';
import {
    getIssueDownloadProgress,
    getIssueDownloadStatus,
    getIssueFilenames,
} from '../util/issueRetrievalUtil';
import { FILE_RETRIEVAL_STATUS, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';
import LogoTitle from './LogoTitle';
import ImageListViewer from './ImageListViewer';
import { useIsMounted } from '../util/checkMountStatusUtil';

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
    cancelIssuePreviewDownload,
    fileCacheMap, 
    getIssuePreview,
    navigation,
    resetSelectedIssue,
    resourceType, 
    selectedIssue
}) => {

    resourceType = resourceType || RESOURCE_TYPE.ISSUE_IMG;

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

    const [issueDownloadStatus, setIssueDownloadStatus] = React.useState();
    const [issueDownloadProgress, setIssueDownloadProgress] = React.useState(0);
    const isMounted = useIsMounted();
    const [isCanceled, setIsCanceled] = React.useState(false);

    React.useEffect(() => {
        const updateStatusAndProgress = async () => {
            let cancelationInQueue = thisIssueIsCancelled(canceledIssues);
            if (!selectedIssue || !fileCacheMap) {
                goBack();
            } else if (cancelationInQueue) {
                setIsCanceled(true);
                goBack();
            } else if (!!selectedIssue && !isCanceled) {
                let downloadStatusResult = await getIssueDownloadStatus(
                    selectedIssue.upload_timestamp, 
                    resourceType, 
                    selectedIssue.total_pages, 
                    fileCacheMap, 
                    canceledIssues);
                if (downloadStatusResult === FILE_RETRIEVAL_STATUS.NOT_STARTED 
                    && resourceType === RESOURCE_TYPE.PREVIEW_IMG) {
                        getIssuePreview(resourceName);
                } else if (downloadStatusResult === FILE_RETRIEVAL_STATUS.IN_PROGRESS) {
                    console.log("setting issue download progress in ViewIssue");
                    let downloadProgressResult = await getIssueDownloadProgress(
                        selectedIssue.upload_timestamp, 
                        resourceType, 
                        selectedIssue.total_pages, 
                        fileCacheMap, 
                        canceledIssues);
                    if (isMounted && issueDownloadProgress !== downloadProgressResult) {
                        console.log("progress " + downloadProgressResult);
                        setTimeout(() => {
                            setIssueDownloadProgress(downloadProgressResult);  
                        }, 0);
                    }
                }
                if (isMounted && issueDownloadStatus !== downloadStatusResult) {
                    console.log(`setting issue download status in IssueListItem: ${downloadStatusResult}`);
                    setTimeout(() => {
                        setIssueDownloadStatus(downloadStatusResult);    
                    }, 0);
                }
            }
        };
        updateStatusAndProgress();
        return () => {};
    }, [selectedIssue, fileCacheMap, canceledIssues]);

    if (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED 
        || isCanceled || !isMounted) {
        console.log("detected cancellation");
        //goBack();
        return null;
    }

    const handleCancelIssueDownloadClick = () => 
        resourceType === RESOURCE_TYPE.PREVIEW_IMG
            ? cancelIssuePreviewDownload(resourceName)
            : cancelIssueDownload(resourceName, totalPages);

    return <View style={styles.container}>
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <ImageListViewer
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
    fileCacheMap: state.fileCacheMap,
    selectedIssue: state.selectedIssue
});

const mapDispatchToProps = dispatch => ({
    cancelIssueDownload: (resourceName, totalPages) => 
        dispatch(cancelIssueDownloadAction(resourceName, totalPages)),
    cancelIssuePreviewDownload: (resourceName) => dispatch(cancelIssuePreviewDownloadAction(resourceName)),
    getIssuePreview: (resourceName) => dispatch(getIssuePreviewAction(resourceName)),
    resetSelectedIssue: () => dispatch({ type: "SELECT_ISSUE", payload: {} })
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIssue);