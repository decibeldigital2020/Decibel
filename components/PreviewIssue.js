import React from 'react';
import PdfViewer from './PdfViewer';
import { ProgressView } from "@react-native-community/progress-view";
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getPreviewPdfFilename, getResource as getResourceAction } from '../actions/fileRetrievalActions';
import { FILE_RETRIEVAL_STATUS, RESOURCE_TYPE } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';

const PreviewIssue = ({ fileCacheMap, getResource, selectedIssue }) => {

    if (!selectedIssue || !fileCacheMap) {
        return null;
    }

    const filename = getPreviewPdfFilename(selectedIssue.upload_timestamp);

    React.useEffect(() => {
        if (!fileCacheMap[filename]) {
            getResource(selectedIssue.upload_timestamp, RESOURCE_TYPE.PREVIEW_PDF);
        }
    }, [selectedIssue]);

    //console.log("fileCacheMap", fileCacheMap);

    if (!fileCacheMap[filename]) {
        return null;
    }

    return <View style={styles.container}>
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <PdfViewer resource={fileCacheMap[filename].localPath} />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED &&
            <ActivityIndicator size={"large"} color={styleConstants.activityIndicator.color} />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
            <ProgressView
                progressTintColor="orange"
                trackTintColor="blue"
                progress={fileCacheMap[filename].progress}
            />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.FAILED &&
            <Text>There was a problem fetching the file. Try again in a few minutes. <ErrorHelperText /></Text>
        }
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const mapStateToProps = state => ({
    fileCacheMap: state.fileCacheMap,
    selectedIssue: state.selectedIssue
});

const mapDispatchToProps = dispatch => ({
    getResource: (filename, resourceType, page) => dispatch(getResourceAction(filename, resourceType, page))
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewIssue);