import { 
    RESOURCE_TYPE, 
    NUMBER_OF_PREVIEW_PAGES, 
    FILE_RETRIEVAL_STATUS 
} from '../constants';
import { 
    getPreviewImagePrefix,
    getIssueImagePrefix 
} from '../util/fileRetrievalUtil';

export const getIssueDownloadProgress = (resourceName, resourceType, totalPages, fileCacheMap) =>
    Object.keys(fileCacheMap)
        .filter(key => key.includes(resourceType === RESOURCE_TYPE.PREVIEW_IMG 
            ? getPreviewImagePrefix(resourceName) 
            : getIssueImagePrefix(resourceName)))
        .filter(key => fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS)
        .filter(key => !!fileCacheMap[key].progress)
        .map(key => fileCacheMap[key].progress);
        .reduce((acc, cur) => acc + (cur/totalPages), 0);

export const getIssuePreviewDownloadProgress = (resourceName, fileCacheMap) =>
    getIssueDownloadProgress(resourceName, RESOURCE_TYPE.PREVIEW_IMG, NUMBER_OF_PREVIEW_PAGES, fileCacheMap);

export const getIssueDownloadStatus = (resourceName, resourceType, totalPages, fileCacheMap) => {
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
            fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS).length > 0) {
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

export const getIssuePreviewDownloadStatus = (resourceName, fileCacheMap) =>
    getIssueDownloadStatus(resourceName, RESOURCE_TYPE.PREVIEW_IMG, NUMBER_OF_PREVIEW_PAGES, fileCacheMap);

export const getIssueFilenames = (resourceName, fileCacheMap) =>
    Object.keys(fileCacheMap)
        .filter(key => key.includes(getIssueImagePrefix(resourceName)))
        .map(key => fileCacheMap[key].localPath);

export const getIssuePreviewFilenames = (resourceName, fileCacheMap) =>
    Object.keys(fileCacheMap)
        .filter(key => key.includes(getPreviewImagePrefix(resourceName)))
        .map(key => fileCacheMap[key].localPath);
