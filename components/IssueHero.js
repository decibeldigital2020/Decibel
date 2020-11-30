import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { 
    getHeroFilename, 
    presignedUrlIsAlive
} from '../util/fileRetrievalUtil';
import {
    getResourceFromUrl as getResourceFromUrlAction,
    getResource as getResourceAction 
} from '../actions/fileRetrievalActions';
import { RESOURCE_TYPE, MAX_PRESIGNED_URL_AGE, FILE_RETRIEVAL_STATUS } from '../constants';
import { styleConstants } from '../constants/styles';
import ErrorHelperText from './ErrorHelperText';

const HERO_IMAGE_SCALE = 150;

const IssueHero = ({fileCacheMap, fileLinkMap, getResource, getResourceFromUrl, uploadTimestamp, visible}) => {

    const filename = getHeroFilename(uploadTimestamp);

    React.useEffect(() => {
        if (!visible) {
            return;
        }
        if (!fileCacheMap[filename]) {
            if (fileLinkMap[filename] 
                    && fileLinkMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED 
                    && presignedUrlIsAlive(fileLinkMap[filename].requestedTimestamp)) {
                getResourceFromUrl(fileLinkMap[filename].url);
            } else if (fileLinkMap[filename] && fileLinkMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED) {
                // Do nothing, wait for url fetch to complete
                return;
            } else {
                getResource(uploadTimestamp, RESOURCE_TYPE.HERO);
            }
        }
    }, [fileCacheMap, fileLinkMap, uploadTimestamp, visible]);

    if (!fileCacheMap[filename]) {
        return null;
    }

    return <View style={styles.container}>
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED &&
            <Image 
                source={{ uri: fileCacheMap[filename].localPath }}
                style={styles.heroImage}
            />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED &&
            <ActivityIndicator size={"large"} color={styleConstants.activityIndicator.color} />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
            <ActivityIndicator size={"large"} color={styleConstants.activityIndicator.color} />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.FAILED &&
            <Text style={styles.errorText}>
                There was a problem fetching this image. Try again in a few minutes. 
                <ErrorHelperText />
            </Text>
        }
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: HERO_IMAGE_SCALE,
        backgroundColor: "#000",
        borderRadius: 6
    },
    errorText: {
        padding: 4
    },
    heroImage: {
        width: HERO_IMAGE_SCALE,
        height: HERO_IMAGE_SCALE * 1.34,
        borderRadius: 6
    }
})

const mapStateToProps = state => ({
    fileCacheMap: state.fileCacheMap,
    fileLinkMap: state.fileLinkMap
});

const mapDispatchToProps = dispatch => ({
    getResource: (uploadTimestamp, resourceType) => dispatch(getResourceAction(uploadTimestamp, resourceType)),
    getResourceFromUrl: (url) => dispatch(getResourceFromUrl(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueHero);