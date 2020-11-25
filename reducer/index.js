import { FILE_CACHE_STATUS } from '../constants';

const initialState = {
    fileCacheMap: {
        /*
         * filename: {
         *   status: oneOf: [requested, in_progress, completed, failed],
         *   localPath: string
         * }
         */
    },
    issueList: null, // mocks.issueListResponse
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
        case "REQUESTING": {
            return {
                ...newState,
                requesting: {
                    ...newState.requesting,
                    [action.payload.name]: action.payload.value
                }
            }
        }
        case "ISSUE_LIST": {
            return {
                ...newState,
                issueList: action.payload
            }
        }
        case "REQUEST_FILE_CACHE": {
            let cacheEntry = Object.assign({}, newState.fileCacheMap[action.payload.filename]);
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = { status: FILE_CACHE_STATUS.REQUESTED };
            return newState;
        }
        case "COMPLETE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
            	status: FILE_CACHE_STATUS.COMPLETED,
            	localPath: action.payload.localPath
            }
            return newState;
        }
        case "FAIL_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
            	status: FILE_CACHE_STATUS.FAILED
            }
            return newState;
        }
        case "IN_PROGRESS_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
                status: FILE_CACHE_STATUS.IN_PROGRESS,
                progress: action.payload.progress
            }
            return newState;
        }
        case "REMOVE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            delete newState.fileCacheMap[action.payload.filename];
            return newState;
        }
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
    	default:
            return state;
    }
}

export default reducer;