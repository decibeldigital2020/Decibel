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

export const cancelIssueDownload = (resourceName, totalPages, fileCacheMap) => async dispatch => {
    for (let i = 0; i < totalPages; i++) {
        let task = fileCacheMap[getIssueImageFilename(resourceName, i)].task;
        if (task) {
            await dispatch(cancelGetResource(getIssueImageFilename(resourceName, i), task));
        }
    }
    await dispatch({
        type: "CANCEL_QUEUE_PUSH",
        payload: {
            resourceName,
            resourceType: RESOURCE_TYPE.ISSUE_IMG
        }
    });
    return Promise.resolve();
}

export const cancelIssuePreviewDownload = (resourceName, fileCacheMap) => async dispatch => {
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        let task = fileCacheMap[getIssueImageFilename(resourceName, i)].task;
        if (task) {
            await dispatch(cancelGetResource(getPreviewImageFilename(resourceName, i), task));
        }
    }
    await dispatch({
        type: "CANCEL_QUEUE_PUSH",
        payload: {
            resourceName,
            resourceType: RESOURCE_TYPE.PREVIEW_IMG
        }
    });
    return Promise.resolve();
}

export const removeIssue = (resourceName, totalPages) => (dispatch, getState) => {
    if (!totalPages) {
        totalPages = getState().issueList.issues
            .filter(issue => issue.upload_timestamp === resourceName)
            .map(issue => issue.total_pages)
            .reduce((acc, cur) => acc.push(cur), [])[0];
            if (!totalPages) {
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
