import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { 
    getHeroFilename, 
    presignedUrlIsAlive
} from '../util/fileRetrievalUtil';
import {
    getResourceFromLink as getResourceFromLinkAction,
    getResource as getResourceAction 
} from '../actions/fileRetrievalActions';
import { 
    RESOURCE_TYPE, 
    MAX_PRESIGNED_URL_AGE, 
    FILE_RETRIEVAL_STATUS,
    HERO_IMAGE_SCALE,
    HERO_IMAGE_RATIO 
} from '../constants';
import { styleConstants } from '../constants/styles';

const IssueHero = ({fileCacheMap, fileLinkMap, getResource, getResourceFromLink, resourceName, visible}) => {

    const filename = getHeroFilename(resourceName);

    React.useEffect(() => {
        if (!visible) {
            return;
        }
        if (!fileCacheMap[filename]) {
            if (fileLinkMap[filename] 
                    && fileLinkMap[filename].status === FILE_RETRIEVAL_STATUS.COMPLETED 
                    && presignedUrlIsAlive(fileLinkMap[filename].requestedTimestamp)) {
                getResourceFromLink(fileLinkMap[filename].url);
            } else if (fileLinkMap[filename] && fileLinkMap[filename].status === FILE_RETRIEVAL_STATUS.REQUESTED) {
                // Do nothing, wait for url fetch to complete
                return;
            } else {
                getResource(resourceName, RESOURCE_TYPE.HERO);
            }
        }
    }, [fileCacheMap, fileLinkMap, resourceName, visible]);

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
            <ActivityIndicator size={"large"} color={styleConstants.activityIndicatorLight.color} />
        }
        { fileCacheMap[filename].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS &&
            <ActivityIndicator size={"large"} color={styleConstants.activityIndicatorLight.color} />
        }
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: HERO_IMAGE_SCALE,
        minHeight: HERO_IMAGE_SCALE * HERO_IMAGE_RATIO,
        backgroundColor: "#000",
        borderRadius: 6
    },
    heroImage: {
        width: HERO_IMAGE_SCALE,
        height: HERO_IMAGE_SCALE * HERO_IMAGE_RATIO,
        borderRadius: 6
    }
})

const mapStateToProps = state => ({
    fileCacheMap: state.fileCacheMap,
    fileLinkMap: state.fileLinkMap
});

const mapDispatchToProps = dispatch => ({
    getResource: (resourceName, resourceType) => dispatch(getResourceAction(resourceName, resourceType)),
    getResourceFromLink: (url) => dispatch(getResourceFromLinkAction(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(IssueHero);