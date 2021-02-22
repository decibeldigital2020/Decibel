import { 
    RESOURCE_TYPE, 
    NUMBER_OF_PREVIEW_PAGES, 
    FILE_RETRIEVAL_STATUS 
} from '../constants';
import { 
    getPreviewImagePrefix,
    getIssueImagePrefix 
} from '../util/fileRetrievalUtil';

export const getIssueDownloadProgress = (resourceName, resourceType, totalPages, fileCacheMap, canceledIssues) =>
    {
    console.log("get issue download progress");
    return canceledIssues.findIndex(i => i.resourceName === resourceName && i.resourceType === resourceType) !== -1
        ? 0
        : Object.keys(fileCacheMap)
            .filter(key => key.includes(resourceType === RESOURCE_TYPE.PREVIEW_IMG 
                ? getPreviewImagePrefix(resourceName) 
                : getIssueImagePrefix(resourceName)))
            .filter(key => fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS || fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.COMPLETED)
            .map(key => (!!fileCacheMap[key].progress ? fileCacheMap[key].progress : 1))
            .reduce((acc, cur) => acc + (cur/totalPages), 0);
    }

export const getIssuePreviewDownloadProgress = (resourceName, fileCacheMap, canceledIssues) =>
    getIssueDownloadProgress(resourceName, RESOURCE_TYPE.PREVIEW_IMG, NUMBER_OF_PREVIEW_PAGES, fileCacheMap, canceledIssues);

export const getIssueDownloadStatus = (resourceName, resourceType, totalPages, fileCacheMap, canceledIssues) => {
    console.log("get issue download status");
    if (canceledIssues.findIndex(i => i.resourceName === resourceName && i.resourceType === resourceType) !== -1) {
        console.log("issue is cancelled");
        return FILE_RETRIEVAL_STATUS.NOT_STARTED;
    }
    let existingCacheKeys = Object.keys(fileCacheMap)
        .filter(key => key.includes(resourceType === RESOURCE_TYPE.PREVIEW_IMG 
            ? getPreviewImagePrefix(resourceName) 
            : getIssueImagePrefix(resourceName)));
    if (existingCacheKeys.length === 0) {
        return FILE_RETRIEVAL_STATUS.NOT_STARTED;
    }
    if (existingCacheKeys.filter(key => 
            fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.FAILED).length > 0) {
        return FILE_RETRIEVAL_STATUS.FAILED;
    }
    if (existingCacheKeys.filter(key => 
            fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS).length > 0
            || (completedCount => completedCount > 0 && completedCount < totalPages)(existingCacheKeys.filter(key => 
                fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.COMPLETED).length)) {
        return FILE_RETRIEVAL_STATUS.IN_PROGRESS;
    }
    if (existingCacheKeys.filter(key => 
            fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.REQUESTED).length > 0) {
        return FILE_RETRIEVAL_STATUS.REQUESTED;
    }
    if (existingCacheKeys.filter(key => 
            fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.COMPLETED).length === totalPages) {
        return FILE_RETRIEVAL_STATUS.COMPLETED;
    }
    return FILE_RETRIEVAL_STATUS.NOT_STARTED; //Failsafe. This should never happen
}

export const getIssuePreviewDownloadStatus = (resourceName, fileCacheMap, canceledIssues) =>
    getIssueDownloadStatus(resourceName, RESOURCE_TYPE.PREVIEW_IMG, NUMBER_OF_PREVIEW_PAGES, fileCacheMap, canceledIssues);

export const getIssuePageNumberFromFilename = (localPath) => {
    const regex = /[\/a-zA-Z0-9-]+_issue-([0-9]+)\.[a-zA-Z]{3}/gm;
    let result = regex.exec(localPath);
    return parseInt(result[1]);
}

export const getPreviewPageNumberFromFilename = (localPath) => {
    const regex = /[\/a-zA-Z0-9-]+_preview-([0-9]+)\.[a-zA-Z]{3}/gm;
    let result = regex.exec(localPath);
    return parseInt(result[1]);
}

export const getIssueFilenames = (resourceName, fileCacheMap) =>
    Object.keys(fileCacheMap)
        .filter(key => key.includes(getIssueImagePrefix(resourceName)))
        .map(key => fileCacheMap[key].localPath)
        .sort((a, b) => getIssuePageNumberFromFilename(a) > getIssuePageNumberFromFilename(b) ? 1 : -1);

export const getIssuePreviewFilenames = (resourceName, fileCacheMap) =>
    Object.keys(fileCacheMap)
        .filter(key => key.includes(getPreviewImagePrefix(resourceName)))
        .map(key => fileCacheMap[key].localPath)
        .sort((a, b) => getPreviewPageNumberFromFilename(a) > getPreviewPageNumberFromFilename(b) ? 1 : -1);
