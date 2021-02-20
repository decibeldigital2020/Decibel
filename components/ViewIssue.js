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

    const [issueDownloadStatus, setIssueDownloadStatus] = React.useState();
    const [issueDownloadProgress, setIssueDownloadProgress] = React.useState(0);

    React.useEffect(() => {
        const updateStatusAndProgress = async () => {
            if (!!selectedIssue) {
                let resourceName = selectedIssue.upload_timestamp;
                let totalPages = selectedIssue.total_pages;
                let downloadStatusResult = await getIssueDownloadStatus(resourceName, resourceType, totalPages, fileCacheMap, canceledIssues);
                if (downloadStatusResult === FILE_RETRIEVAL_STATUS.NOT_STARTED) {
                    getIssuePreview(resourceName);
                } else if (downloadStatusResult === FILE_RETRIEVAL_STATUS.IN_PROGRESS) {
                    setIssueDownloadProgress(await getIssueDownloadProgress(resourceName, resourceType, totalPages, fileCacheMap, canceledIssues));
                    setIssueDownloadStatus(downloadStatusResult);
                } else {
                    setIssueDownloadStatus(downloadStatusResult);    
                }
            }
        };
        updateStatusAndProgress();
    }, [selectedIssue, fileCacheMap, canceledIssues]);

    const MiddleSpinner = () => 
        <View style={styles.container}>
            <View style={styles.requested}>
                <View style={styles.logoTitle}>
                    <LogoTitle style={styles.logoTitleImage} />
                </View>
                <ActivityIndicator size={"large"} color={styles.activityIndicator.color} style={styles.requestedActivityIndicator} />
            </View>
        </View>;

    const goBack = () => {
        navigation && navigation.navigate && navigation.navigate('RootTabNavigator');
    }

    if (!selectedIssue || !fileCacheMap) {
        goBack();
        // resetSelectedIssue();
        return <MiddleSpinner />
    }

    let resourceName = selectedIssue.upload_timestamp;
    let totalPages = selectedIssue.total_pages;

    if (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED 
        || canceledIssues.findIndex(i => i.resourceName === resourceName && i.resourceType === resourceType) !== -1) {
        goBack();
        // resetSelectedIssue();
        return <MiddleSpinner />;
    }

    const handleCancelIssueDownloadClick = () => 
        resourceType === RESOURCE_TYPE.PREVIEW_IMG
            ? cancelIssuePreviewDownload(resourceName, fileCacheMap)
            : cancelIssueDownload(resourceName, totalPages, fileCacheMap);

    return <View style={styles.container}>
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <ImageListViewer
                goBack={goBack}
                resourceName={resourceName}
                resourceType={RESOURCE_TYPE.ISSUE_IMG} />
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
    cancelIssueDownload: (resourceName, totalPages, fileCacheMap) => 
        dispatch(cancelIssueDownloadAction(resourceName, totalPages, fileCacheMap)),
    cancelIssuePreviewDownload: (resourceName, fileCacheMap) => dispatch(cancelIssuePreviewDownloadAction(resourceName, fileCacheMap)),
    getIssuePreview: (resourceName) => dispatch(getIssuePreviewAction(resourceName)),
    resetSelectedIssue: () => dispatch({ type: "SELECT_ISSUE", payload: {} })
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIssue);