import { 
    FILE_RETRIEVAL_STATUS,
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

export const getIssue = (issue, resourceType) => dispatch => {
    let resourceName = issue.upload_timestamp;
    resourceType = resourceType || RESOURCE_TYPE.ISSUE_IMG;
    let totalPages = resourceType === RESOURCE_TYPE.PREVIEW_IMG 
        ? NUMBER_OF_PREVIEW_PAGES 
        : issue.total_pages;
    dispatch({
        type: "UNCANCEL_ISSUE",
        payload: {
            resourceName,
            resourceType
        }
    });
    dispatch({
        type: "DOWNLOAD_QUEUE_PUSH",
        payload: {
            resourceName,
            resourceType,
            pages: totalPages
        }
    });
}

export const cancelIssueDownload = (resourceName, totalPages, resourceType) => 
    async (dispatch, getState) => {
        let fileCacheMap = getState().fileCacheMap;
        totalPages = RESOURCE_TYPE.PREVIEW_IMG ? NUMBER_OF_PREVIEW_PAGES : totalPages;
        for (let i = 0; i < totalPages; i++) {
            let filename = resourceType === RESOURCE_TYPE.PREVIEW_IMG 
                ? getPreviewImageFilename(resourceName, i) 
                : getIssueImageFilename(resourceName, i);
            let entry = fileCacheMap[filename];
            if (entry && entry.task) {
                await dispatch(cancelGetResource(filename, entry.task, resourceName, resourceType));
            }
        }
        await dispatch({
            type: "CANCEL_QUEUE_PUSH",
            payload: {
                resourceName,
                resourceType: resourceType || RESOURCE_TYPE.ISSUE_IMG
            }
        });
        return Promise.resolve();
    };

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
        dispatch(removeResource(getIssueImageFilename(resourceName, i), resourceName, RESOURCE_TYPE.ISSUE_IMG));
    }
}

export const removeIssuePreview = (resourceName) => dispatch => {
    for (let i = 0; i < NUMBER_OF_PREVIEW_PAGES; i++) {
        dispatch(removeResource(getPreviewImageFilename(resourceName, i), resourceName, RESOURCE_TYPE.PREVIEW_IMG));
    }
}

export const resetIssueFailedStatus = (issue, resourceType) => async (dispatch, getState) => {
    let resourceName = issue.upload_timestamp;
    let state = getState();
    let fileCacheMap = state.fileCacheMap;
    await Object.keys(fileCacheMap)
        .map(filename => {
            let entry = {...fileCacheMap[filename]};
            entry.filename = filename;
            return entry;
        })
        .filter(entry => 
            entry.status === FILE_RETRIEVAL_STATUS.FAILED
                && entry.filename.includes(resourceName)
                && entry.filename.includes(resourceType === RESOURCE_TYPE.PREVIEW_IMG
                    ? "preview"
                    : "issue")
        )
        .forEach(async entry => {
            await dispatch({
                type: "REMOVE_FILE_CACHE",
                payload: {
                    filename: entry.filename,
                    resourceName,
                    resourceName
                }
            })
        });
}
