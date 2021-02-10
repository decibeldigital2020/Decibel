import { ENDPOINT_RESOURCE_LAMBDA, RESOURCE_TYPE } from '../constants';
import RNFetchBlob from 'rn-fetch-blob';
import {
    getPreviewPdfFilename,
    getPreviewImageFilename,
    getHeroFilename,
    getIssueFilename,
    getFilenameByResourceType,
    presignedUrlIsAlive,
    getFilenameFromUrl
} from '../util/fileRetrievalUtil';
import { Alert } from 'react-native';

const INVALIDATED_SUBSCRIPTION_ERROR_MSG = "You do not have access to download this issue. If your subscription is active, go to the Help page to restore your purchases.";

const headers = {
    'Content-Type': 'application/json'
};

const PROGRESS_FACTOR = 100;

const failFileCache = (err, dispatch, filename) => {
    // console.error("Error fetching resource", JSON.stringify(err));
    dispatch({ type: "FAIL_FILE_CACHE", payload: { filename }});
}

const getFilePath = (filename) => (RNFetchBlob.fs.dirs.DocumentDir + "/" + filename);

const fetchResource = (dispatch, filename, url) => {
    let dirs = RNFetchBlob.fs.dirs;
    let task = RNFetchBlob.config({ path : getFilePath(filename) }).fetch('GET', url);
    dispatch({ type: "REQUEST_FILE_CACHE", payload: { filename, task } });
    return task.progress({ count : PROGRESS_FACTOR }, (received, total) => {
        //console.log('progress', received / total);
        dispatch({
            type: "IN_PROGRESS_FILE_CACHE",
            payload: {
                filename,
                progress: (received / total)
            }
        });
    }).then((resourceResponse) => {
        //console.log('Got resource response', resourceResponse);
        dispatch({
            type: "COMPLETE_FILE_CACHE",
            payload: {
                filename,
                localPath: resourceResponse.path()
            }
        });
    }).catch(err => failFileCache(err, dispatch, filename));    
}

export const cancelGetResource = (filename, task) => dispatch => {
    task && task.cancel(err => {
        if (err) {
            console.error("Error canceling task", filename, task, JSON.stringify(err));
            dispatch({
                type: "FAIL_FILE_CACHE",
                payload: { filename }
            })
            return;
        }
        dispatch({
            type: "REMOVE_FILE_CACHE",
            payload: { filename }
        });
    });
}

export const getResourceLink = (resourceName, resourceType, page) => dispatch => {
    let filename = getFilenameByResourceType(resourceName, resourceType);
    let data = {
        resource_type: resourceType,
        resource_name: resourceName
    };
    if (page) {
        data.page = page;
    }
    //console.log("Fetching link " + ENDPOINT_RESOURCE_LAMBDA, data, filename);
    dispatch({ type: "REQUEST_FILE_LINK", payload: { filename } });
    fetch(ENDPOINT_RESOURCE_LAMBDA, {
        body: JSON.stringify(data),
        headers,
        method: "POST"
    }).then(response => {
        //console.log("Received response", response);
        if (response.status !== 200) {
            console.error("Status not 200", response.status);
            throw new Error(response);
        }
        return response.json();
    }).then(responseJson => {
        //console.log("Response json", responseJson);
        if (!responseJson.url) {
            console.error("No url in response");
            throw new Error(responseJson);
        }
        dispatch({
            type: "COMPLETE_FILE_LINK",
            payload: {
                filename,
                url: responseJson.url
            }
        });
    }).catch(err => {
        console.error("Error fetching resource link", err);
        dispatch({ type: "FAIL_FILE_LINK", payload: { filename }});
    });
}

export const getResourceFromLink = (url) => dispatch => {
    let filename = getFilenameFromUrl(url);
    fetchResource(dispatch, filename, url);
}

export const getResource = (resourceName, resourceType, page, receipt) => dispatch => {
    let filename = getFilenameByResourceType(resourceName, resourceType);
    let data = {
        resource_type: resourceType,
        resource_name: resourceName
    };
    if (page) {
        data.page = page;
    }
    if (receipt) {
        data.receipt = receipt;
    }
    //console.log("Fetching resource " + ENDPOINT_RESOURCE_LAMBDA, data, filename);
    dispatch({ type: "REQUEST_FILE_CACHE", payload: { filename } });
    fetch(ENDPOINT_RESOURCE_LAMBDA, {
        body: JSON.stringify(data),
        headers,
        method: "POST"
    }).then(response => {
        //console.log("Received response", response);
        if (response.status !== 200) {
            console.error("Status not 200", response.status);
            if (response.status === 401 && (resourceType === RESOURCE_TYPE.ISSUE || resourceType === RESOURCE_TYPE.ISSUE_IMG)) {
                Alert.alert("Error", INVALIDATED_SUBSCRIPTION_ERROR_MSG);
                dispatch(invalidateActiveSubscription());
            }
            throw new Error(response);
        }
        return response.json();
    }).then(responseJson => {
        //console.log("Response json", responseJson);
        if (!responseJson.url) {
            console.error("No url in response");
            throw new Error(responseJson);
        }
        let url = responseJson.url;
        fetchResource(dispatch, filename, url);
    }).catch(err => failFileCache(err, dispatch, filename));
}

export const invalidateActiveSubscription = () => dispatch => {
    dispatch({
        type: "ACTIVE_SUBSCRIPTION",
        payload: null
    });
}

export const removeResource = (filename) => dispatch => {
    RNFetchBlob.fs.unlink(getFilePath(filename))
        .then(() => {
            dispatch({
                type: "REMOVE_FILE_CACHE",
                payload: { filename }
            });
        })
        .catch(err => failFileCache(err, dispatch, filename));
}