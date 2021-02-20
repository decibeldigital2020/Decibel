import { 
    RESOURCE_TYPE, 
    NUMBER_OF_PREVIEW_PAGES
} from '../constants';
import { 
    getPreviewImageFilename,
    getIssueImageFilename
} from '../util/fileRetrievalUtil';
import {
    cancelGetResource,
    removeResource
} from './fileRetrievalActions';

export const getIssue = (resourceName, totalPages) => dispatch => {
    dispatch({
        type: "UNCANCEL_ISSUE",
        payload: {
            resourceName,
            resourceType: RESOURCE_TYPE.ISSUE_IMG
        }
    });
    for (let i = 0; i < totalPages; i++) {
        dispatch({
            type: "DOWNLOAD_QUEUE_PUSH",
            payload: {
                resourceName,
                resourceType: RESOURCE_TYPE.ISSUE_IMG,
                page: i
            }
        });
    }
}

export const getIssuePreview = (resourceName) => dispatch => {
    dispatch({
        type: "UNCANCEL_ISSUE",
        payload: {
            resourceName,
            resourceType: RESOURCE_TYPE.PREVIEW_IMG
        }
    });
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        dispatch({
            type: "DOWNLOAD_QUEUE_PUSH",
            payload: {
                resourceName,
                resourceType: RESOURCE_TYPE.PREVIEW_IMG,
                page: i
            }
        });
    }
}

export const cancelIssueDownload = (resourceName, totalPages, fileCacheMap, resourceType) => async dispatch => {
    for (let i = 0; i < totalPages; i++) {
        let filename = resourceType === RESOURCE_TYPE.PREVIEW_IMG 
            ? getPreviewImageFilename(resourceName, i) 
            : getIssueImageFilename(resourceName, i);
        let entry = fileCacheMap[filename];
        if (entry && entry.task) {
            await dispatch(cancelGetResource(filename, entry.task));
        }
    }
    await dispatch({
        type: "CANCEL_QUEUE_PUSH",
        payload: {
            resourceName,
            resourceType: RESOURCE_TYPE.ISSUE_IMG
        }
    });
    // return Promise.resolve();
}

export const cancelIssuePreviewDownload = (resourceName, fileCacheMap) => async dispatch => {
    return await cancelIssueDownload(resourceName, NUMBER_OF_PREVIEW_PAGES, fileCacheMap, RESOURCE_TYPE.PREVIEW_IMG);
}

export const removeIssue = (resourceName, totalPages) => (dispatch, getState) => {
    // console.log("state", getState().issueList.issues.filter(issue => issue.upload_timestamp === resourceName).map(issue => issue.total_pages));
    if (!totalPages) {
        let results = getState().issueList.issues
            .filter(issue => issue.upload_timestamp === resourceName)
            .map(issue => issue.total_pages);
        if (results.length > 0) {
            totalPages = results[0];
        } else {
            return;
        }
    }
    for (let i = 0; i < totalPages; i++) {
        dispatch(removeResource(getIssueImageFilename(resourceName, i)));
    }
}

export const removeIssuePreview = (resourceName) => dispatch => {
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        dispatch(removeResource(getPreviewImageFilename(resourceName, i)));
    }
}
