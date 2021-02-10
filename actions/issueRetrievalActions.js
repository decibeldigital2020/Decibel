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

// Note: preview page numbers are 1 through N, while full issue page numbers are 0 through N-1

export const getIssue = (resourceName, totalPages, receipt) => dispatch => {
    for (let i = 0; i < totalPages; i++) {
        dispatch({
            type: "DOWNLOAD_QUEUE_PUSH",
            payload: {
                resourceName,
                resourceType: RESOURCE_TYPE.ISSUE_IMG,
                page: i,
                receipt
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

export const removeIssue = (resourceName, totalPages) => dispatch => {
    for (let i = 0; i < totalPages; i++) {
        dispatch(removeResource(getIssueImageFilename(resourceName, i)));
    }
}

export const removeIssuePreview = (resourceName) => dispatch => {
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        let page = i;
        dispatch(removeResource(getPreviewImageFilename(resourceName, page)));
    }
}

export const cancelIssueDownload = (resourceName, totalPages, receipt, fileCacheMap) => dispatch => {
    for (let i = 0; i < totalPages; i++) {
        dispatch({
            type: "DOWNLOAD_QUEUE_POP",
            payload: {
                resourceName,
                resourceType: RESOURCE_TYPE.ISSUE_IMG,
                page: i,
                receipt
            }
        });
        let task = fileCacheMap[getIssueImageFilename(resourceName, i)].task;
        dispatch(cancelGetResource(getIssueImageFilename(resourceName, i), task));
        dispatch(removeIssue(resourceName, totalPages));
    }
}

export const cancelIssuePreviewDownload = (resourceName, fileCacheMap) => dispatch => {
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        let page = i;
        dispatch({
            type: "DOWNLOAD_QUEUE_POP",
            payload: {
                resourceName,
                resourceType: RESOURCE_TYPE.PREVIEW_IMG,
                page
            }
        });
        let task = fileCacheMap[getIssueImageFilename(resourceName, page)].task;
        dispatch(cancelGetResource(getPreviewImageFilename(resourceName, page), task));
        dispatch(removeIssuePreview(resourceName));
    }
}
