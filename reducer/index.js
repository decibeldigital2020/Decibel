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
    downloadQueue: [
        // {
        //     resourceName,
        //     resourceType,
        //     page,
        //     receipt
        // }
    ],
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
    orientation: null,
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
    selectedIssue: null, // item from mocks.issueListResponse.issues
    selectedReceipt: null // IAP.Purchase
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
        case "DOWNLOAD_QUEUE_POP": {
            let newDownloadQueue = [...newState.downloadQueue];
            let index = newDownloadQueue.findIndex(q => 
                q.resourceName === action.payload.resourceName &&
                q.resourceType === action.payload.resourceType &&
                q.page === action.payload.page &&
                q.receipt === action.payload.receipt);
            if (index !== -1) {
                newDownloadQueue.splice(index, 1);
            }
            newState.downloadQueue = newDownloadQueue;
            return newState;
        }
        case "DOWNLOAD_QUEUE_PUSH": {
            let newDownloadQueue = [...newState.downloadQueue];
            newDownloadQueue.push(action.payload);
            newState.downloadQueue = newDownloadQueue;
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
        case "ORIENTATION": {
            return {
                ...newState,
                orientation: action.payload.orientation
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
                    newState.selectedReceipt = action.payload.receipt;
                } else {
                    newState.selectedIssue = null;
                    newState.selectedReceipt = null;
                }
            } else {
                newState.selectedIssue = null;
                newState.selectedReceipt = null;
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