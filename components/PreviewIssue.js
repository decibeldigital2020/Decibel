import React from 'react';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import {
    cancelIssuePreviewDownload as cancelIssuePreviewDownloadAction,
    getIssuePreview as getIssuePreviewAction
} from '../actions/issueRetrievalActions';
import {
    getIssuePreviewDownloadProgress,
    getIssuePreviewDownloadStatus,
    getIssuePreviewFilenames
} from '../util/issueRetrievalUtil';
import { FILE_RETRIEVAL_STATUS, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';
import LogoTitle from './LogoTitle';
import ImageListViewer from './ImageListViewer';

const PreviewIssue = ({
    cancelIssuePreviewDownload,
    fileCacheMap, 
    getIssuePreview,
    navigation, 
    resetSelectedIssue,
    selectedIssue
}) => {

    const goBack = () => navigation && navigation.navigate && navigation.navigate('RootTabNavigator');

    if (!selectedIssue || !fileCacheMap) {
        goBack();
        return null;
    }

    let resourceName = selectedIssue.upload_timestamp;
    let resourceType = RESOURCE_TYPE.ISSUE_IMG;
    let issueDownloadStatus = getIssuePreviewDownloadStatus(resourceName, fileCacheMap);

    React.useEffect(() => {
        if (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED) {
            // TODO evict older previews
            getIssuePreview(resourceName);
        }
    }, [selectedIssue]);

    return <View style={styles.container}>
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <ImageListViewer
                filenames={getIssuePreviewFilenames(resourceName, fileCacheMap)}
                goBack={goBack}
                resourceType={RESOURCE_TYPE.PREVIEW_IMG} />
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
                    <Text style={styles.inProgressText}>Downloading ({Math.floor(getIssuePreviewDownloadProgress(resourceName, fileCacheMap)*100)}%)...</Text>
                    <ProgressView
                        progressTintColor={styles.progressTintColor.color}
                        trackTintColor={styles.trackTintColor.color}
                        progress={getIssuePreviewDownloadProgress(resourceName, fileCacheMap)}
                    />
                </View>
                <Button
                    color={styleConstants.actionButton.color}
                    onPress={async () => {
                        await cancelIssuePreviewDownload(resourceName, fileCacheMap);
                        resetSelectedIssue();
                    }}
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
                    onPress={async () => {
                        await cancelIssuePreviewDownload(resourceName, fileCacheMap);
                        resetSelectedIssue();
                    }}
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
    fileCacheMap: state.fileCacheMap,
    selectedIssue: state.selectedIssue
});

const mapDispatchToProps = dispatch => ({
    cancelIssuePreviewDownload: (resourceName, fileCacheMap) => dispatch(cancelIssuePreviewDownloadAction(resourceName, fileCacheMap)),
    getIssuePreview: (resourceName) => dispatch(getIssuePreviewAction(resourceName)),
    resetSelectedIssue: () => dispatch({ type: "SELECT_ISSUE", payload: {} })
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewIssue);