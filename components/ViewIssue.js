import React from 'react';
import PdfViewer from './PdfViewer';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { getIssueFilename, getPreviewPdfFilename } from '../util/fileRetrievalUtil';
import { 
    cancelGetResource as cancelGetResourceAction,
    getResource as getResourceAction, 
    removeResource as removeResourceAction 
} from '../actions/fileRetrievalActions';
import { FILE_RETRIEVAL_STATUS, MAX_PREVIEW_CACHE_SIZE, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';
import LogoTitle from './LogoTitle';

const ViewIssue = ({ cancelGetResource, fileCacheMap, getResource, navigation, previewOnly, removeResource, selectedIssue }) => {

    if (!selectedIssue || !fileCacheMap) {
        return null;
    }

    const filename = previewOnly 
        ? getPreviewPdfFilename(selectedIssue.upload_timestamp)
        : getIssueFilename(selectedIssue.upload_timestamp);

    React.useEffect(() => {
        if (!fileCacheMap[filename]) {
            if (previewOnly) {
                // Only keep 5 previews in cache at a time
                const previewsInCache = Object.keys(fileCacheMap).filter(key => key.includes("_preview.pdf"));
                //console.log("previewsInCache", previewsInCache);
                if (previewsInCache.length >= MAX_PREVIEW_CACHE_SIZE) {
                    removeResource(previewsInCache[0]);
                }
            }
            getResource(selectedIssue.upload_timestamp, RESOURCE_TYPE.PREVIEW_PDF);
        }
    }, [selectedIssue]);

    if (!fileCacheMap[filename]) {
        return null;
    }

    return <View style={styles.container}>
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <React.Fragment>
                <PdfViewer 
                    cacheKey={filename} 
                    navigation={navigation}
                    resource={fileCacheMap[filename].localPath} />
                <Button
                    color={styleConstants.passiveButton.color}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.goBackButton}
                    title={"Back"}
                />
            </React.Fragment>
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED &&
            <View style={styles.requested}>
                <View style={styles.logoTitle}>
                    <LogoTitle style={styles.logoTitleImage} />
                </View>
                <ActivityIndicator size={"large"} color={styles.activityIndicator.color} style={styles.requestedActivityIndicator} />
            </View>
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
            <View style={styles.inProgress}>
                <View style={styles.logoTitle}>
                    <LogoTitle style={styles.logoTitleImage} />
                </View>
                <Text style={styles.issueTitle}>{ selectedIssue.display_date + " - " + selectedIssue.issue_name }</Text>
                <View style={styles.progressInfo}>
                    <Text style={styles.inProgressText}>Downloading ({Math.floor(fileCacheMap[filename].progress*100)}%)...</Text>
                    <ProgressView
                        progressTintColor={styles.progressTintColor.color}
                        trackTintColor={styles.trackTintColor.color}
                        progress={fileCacheMap[filename].progress}
                    />
                </View>
                { fileCacheMap[filename].task &&
                    <Button
                        color={styleConstants.actionButton.color}
                        onPress={() => {
                            cancelGetResource(filename, fileCacheMap[filename].task);
                            navigation.goBack();
                        }}
                        style={styles.cancelDownloadButton}
                        title={"Cancel download"}
                    />
                }
                <Button
                    color={styleConstants.passiveButton.color}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.goBackButton}
                    title={"Continue in background"}
                />
            </View>
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.FAILED &&
            <Text>There was a problem fetching the file. Try again in a few minutes. <ErrorHelperText /></Text>
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
        backgroundColor: "#000"
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
    cancelGetResource: (filename, task) => dispatch(cancelGetResourceAction(filename, task)),
    getResource: (resourceName, resourceType, page) => dispatch(getResourceAction(resourceName, resourceType, page)),
    removeResource: (filename) => dispatch(removeResourceAction(filename))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewIssue);