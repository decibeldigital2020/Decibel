import { FILE_RETRIEVAL_STATUS } from '../constants';

const initialState = {
    activeSubscription: null, // IAP.Purchase
    availableProducts: [
        // IAP.Product
    ],
    availableSubscriptions: [
        // IAP.Product
    ],
    currentVersion: null,
    downloadedIssues: {
        /*
         * uploadTimestamp: {
         *   [pageNumber]: {
         *     filename: String,
         *     status: oneOf: [requested, in_progress, completed, failed]
         *   }
         * }
         */
    },
    downloadedPreviews: {
        /*
         * uploadTimestamp: {
         *   [pageNumber]: {
         *     filename: String,
         *     status: oneOf: [requested, in_progress, completed, failed]
         *   }
         * }
         */
    },
    fileCacheMap: {
        /*
         * filename: {
         *   status: oneOf: [requested, in_progress, completed, failed],
         *   localPath: string: "/var/.../file.ext"
         * }
         */
    },
    fileLinkMap: {
        /*
         * filename: {
         *   status: oneOf: [requested, completed],
         *   url: "presigned s3 link to resource",
         *   requestedTimestamp: int: (s3 presigned links expire after 5 minutes)
         * }
         */
    },
    issueList: null, // See mocks.issueListResponse
    issueListRequestedTimestamp: 0,
    ownedProducts: [
        /*
         * IAP.Purchase
         */
    ],
    ownedProductsRequestedTimestamp: 0,
    processingTransaction: false,
    requesting: {
        /*
         * name: oneOf: [true, false]
         */
    },
    selectedIssue: null // item from mocks.issueListResponse.issues
};

const reducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);
    switch(action.type) {
        case "ACTIVE_SUBSCRIPTION": {
            return {
                ...newState,
                activeSubscription: action.payload
            }
        }
        case "AVAILABLE_PRODUCTS": {
            return {
                ...newState,
                availableProducts: action.payload
            }
        }
        case "AVAILABLE_SUBSCRIPTIONS": {
            return {
                ...newState,
                availableSubscriptions: action.payload
            }
        }
        case "CLEAR_CACHE": {
            return {
                ...newState,
                fileCacheMap: {
                    ...initialState.fileCacheMap
                }
            }
        }
        case "COMPLETE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
                status: FILE_RETRIEVAL_STATUS.COMPLETED,
                localPath: action.payload.localPath
            }
            return newState;
        }
        case "COMPLETE_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            let newLinkEntry = Object.assign(newState.fileLinkMap[action.payload.filename],
            {
                status: FILE_RETRIEVAL_STATUS.COMPLETED,
                url: action.payload.url
            });
            newState.fileLinkMap[action.payload.filename] = newLinkEntry;
            return newState;
        }
        case "COMPLETE_ISSUE_PAGE": {
            // action.payload = { uploadTimestamp, page }
            newState.downloadedIssues = Object.assign({}, newState.downloadedIssues);
            newState.downloadedIssues[action.payload.uploadTimestamp][action.payload.page] = {
                ...newState.downloadedIssues[action.payload.uploadTimestamp][action.payload.page],
                status: FILE_RETRIEVAL_STATUS.COMPLETED
            }
        }
        case "IN_PROGRESS_ISSUE_PAGE": {
            // action.payload = { uploadTimestamp, page, progress }
            newState.downloadedIssues = Object.assign({}, newState.downloadedIssues);
            newState.downloadedIssues[action.payload.uploadTimestamp][action.payload.page] = {
                ...newState.downloadedIssues[action.payload.uploadTimestamp][action.payload.page],
                progress: action.payload.progress,
                status: FILE_RETRIEVAL_STATUS.IN_PROGRESS
            }
        }
        case "REQUEST_ISSUE_PAGE": {
            // action.payload = { uploadTimestamp, page, filename }
            newState.downloadedIssues = Object.assign({}, newState.downloadedIssues);
            newState.downloadedIssues[action.payload.uploadTimestamp][action.payload.page] = {
                filename: action.payload.filename,
                status: FILE_RETRIEVAL_STATUS.REQUESTED
            }
        }
        case "DOWNLOAD_ISSUE_FAILED": {
            // action.payload = uploadTimestamp
            newState.downloadedIssues = Object.assign({}, newState.downloadedIssues);
            delete newState.downloadedIssues[action.payload];
            return newState;
        }
        case "COMPLETE_PREVIEW_PAGE": {
            // action.payload = { uploadTimestamp, page }
            newState.downloadedPreviews = Object.assign({}, newState.downloadedPreviews);
            newState.downloadedPreviews[action.payload.uploadTimestamp][action.payload.page] = {
                ...newState.downloadedPreviews[action.payload.uploadTimestamp][action.payload.page],
                status: FILE_RETRIEVAL_STATUS.COMPLETED
            }
        }
        case "IN_PROGRESS_PREVIEW_PAGE": {
            // action.payload = { uploadTimestamp, page, progress }
            newState.downloadedPreviews = Object.assign({}, newState.downloadedPreviews);
            newState.downloadedPreviews[action.payload.uploadTimestamp][action.payload.page] = {
                ...newState.downloadedPreviews[action.payload.uploadTimestamp][action.payload.page],
                progress: action.payload.progress,
                status: FILE_RETRIEVAL_STATUS.IN_PROGRESS
            }
        }
        case "REQUEST_PREVIEW_PAGE": {
            // action.payload = { uploadTimestamp, page, filename }
            newState.downloadedPreviews = Object.assign({}, newState.downloadedPreviews);
            newState.downloadedPreviews[action.payload.uploadTimestamp][action.payload.page] = {
                filename: action.payload.filename,
                status: FILE_RETRIEVAL_STATUS.REQUESTED
            }
        }
        case "DOWNLOAD_PREVIEW_FAILED": {
            // action.payload = uploadTimestamp
            newState.downloadedPreviews = Object.assign({}, newState.downloadedPreviews);
            delete newState.downloadedPreviews[action.payload];
            return newState;
        }
        case "FAIL_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
                status: FILE_RETRIEVAL_STATUS.FAILED
            }
            return newState;
        }
        case "FAIL_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            let newLinkEntry = Object.assign(newState.fileLinkMap[action.payload.filename],
            {
                status: FILE_RETRIEVAL_STATUS.FAILED
            });
            newState.fileLinkMap[action.payload.filename] = newLinkEntry;
            return newState;
        }
        case "IN_PROGRESS_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            let newCacheEntry = Object.assign({}, newState.fileCacheMap[action.payload.filename]);
            newState.fileCacheMap[action.payload.filename] = {
                ...newCacheEntry,
                status: FILE_RETRIEVAL_STATUS.IN_PROGRESS,
                progress: action.payload.progress
            }
            return newState;
        }
        // Save issue list
        case "ISSUE_LIST": {
            return {
                ...newState,
                issueList: action.payload,
                issueListRequestedTimestamp: Date.now()
            }
        }
        //In app purchases
        case "PROCESSING_TRANSACTION": {
            return {
                ...newState,
                processingTransaction: action.payload
            }
        }
        case "PURCHASE": {
            let newOwnedProducts = [...newState.ownedProducts];
            newOwnedProducts.push(action.payload.purchase);
            return {
                ...newState,
                ownedProducts: newOwnedProducts
            };
        }
        case "RESTORE_PURCHASES": {
            return {
                ...newState,
                ownedProducts: action.payload
            }
        }
        case "REMOVE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            delete newState.fileCacheMap[action.payload.filename];
            return newState;
        }
        case "REMOVE_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            delete newState.fileLinkMap[action.payload.filename];
            return newState;
        }
        case "REQUEST_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = { 
                status: FILE_RETRIEVAL_STATUS.REQUESTED,
                task: action.payload.task
            };
            return newState;
        }
        case "REQUEST_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            newState.fileLinkMap[action.payload.filename] = { 
                status: FILE_RETRIEVAL_STATUS.REQUESTED,
                requestedTimestamp: Date.now()
            }
            return newState;
        }
        case "REQUESTING": {
            return {
                ...newState,
                requesting: {
                    ...newState.requesting,
                    [action.payload.name]: action.payload.value
                }
            }
        }
        // Select an issue to focus on
        case "SELECT_ISSUE": {
            if (newState.issueList && action.payload.productId) {
                let index = newState.issueList.issues.findIndex(issue => issue.product_id === action.payload.productId);
                if (index !== -1) {
                    newState.selectedIssue = newState.issueList.issues[index];
                } else {
                    newState.selectedIssue = null;
                }
            } else {
                newState.selectedIssue = null;
            }
            return newState;
        }
        case "VERSION": {
            return {
                ...newState,
                currentVersion: action.payload
            }
        }
    	default:
            return state;
    }
}

export default reducer;