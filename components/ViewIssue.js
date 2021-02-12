import React from 'react';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import {
    cancelIssueDownload as cancelIssueDownloadAction,
    removeIssue as removeIssueAction
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
    cancelIssueDownload,
    fileCacheMap, 
    navigation, 
    selectedIssue
}) => {

    const goBack = () => navigation && navigation.navigate && navigation.navigate('RootTabNavigator');

    if (!selectedIssue || !fileCacheMap) {
        goBack();
        return null;
    }

    let resourceName = selectedIssue.upload_timestamp;
    let resourceType = RESOURCE_TYPE.ISSUE_IMG;
    let totalPages = selectedIssue.total_pages;
    let issueDownloadStatus = getIssueDownloadStatus(resourceName, resourceType, totalPages, fileCacheMap);

    if (issueDownloadStatus === FILE_RETRIEVAL_STATUS.NOT_STARTED) {
        goBack();
        return null;
    }

    return <View style={styles.container}>
        { issueDownloadStatus === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <ImageListViewer
                filenames={getIssueFilenames(resourceName, fileCacheMap)}
                goBack={goBack}
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
                    <Text style={styles.inProgressText}>Downloading ({Math.floor(getIssueDownloadProgress(resourceName, resourceType, totalPages, fileCacheMap)*100)}%)...</Text>
                    <ProgressView
                        progressTintColor={styles.progressTintColor.color}
                        trackTintColor={styles.trackTintColor.color}
                        progress={getIssueDownloadProgress(resourceName, resourceType, totalPages, fileCacheMap)}
                    />
                </View>
                {/*<Button
                    color={styleConstants.actionButton.color}
                    onPress={() => {
                        cancelIssueDownload(resourceName, totalPages, fileCacheMap);
                        resetSelectedIssue();
                        goBack();
                    }}
                    style={styles.cancelDownloadButton}
                    title={"Cancel download"}
                />*/}
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
                    onPress={() => {
                        removeIssue(resourceName, totalPages);
                        goBack();
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
    cancelIssueDownload: (resourceName, totalPages, fileCacheMap) => dispatch(cancelIssueDownloadAction(resourceName, totalPages, fileCacheMap)),
    removeIssue: (resourceName, totalPages) => dispatch(removeIssueAction(resourceName, totalPages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIssue);