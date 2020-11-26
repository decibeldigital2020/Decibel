import { FILE_RETRIEVAL_STATUS } from '../constants';

const initialState = {
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
    issueList: null, // mocks.issueListResponse
    issueListRequestedTimestamp: 0,
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

        // Save issue list
        case "ISSUE_LIST": {
            return {
                ...newState,
                issueList: action.payload,
                issueListRequestedTimestamp: Date.now()
            }
        }

        // File link map actions
        case "REQUEST_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            newState.fileLinkMap[action.payload.filename] = { 
                status: FILE_RETRIEVAL_STATUS.REQUESTED,
                requestedTimestamp: Date.now()
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
        case "FAIL_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            let newLinkEntry = Object.assign(newState.fileLinkMap[action.payload.filename],
            {
                status: FILE_RETRIEVAL_STATUS.FAILED
            });
            newState.fileLinkMap[action.payload.filename] = newLinkEntry;
            return newState;
        }
        case "REMOVE_FILE_LINK": {
            newState.fileLinkMap = Object.assign({}, newState.fileLinkMap);
            delete newState.fileLinkMap[action.payload.filename];
            return newState;
        }

        // File cache actions
        case "REQUEST_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = { status: FILE_RETRIEVAL_STATUS.REQUESTED };
            return newState;
        }
        case "COMPLETE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
            	status: FILE_RETRIEVAL_STATUS.COMPLETED,
            	localPath: action.payload.localPath
            }
            return newState;
        }
        case "FAIL_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
            	status: FILE_RETRIEVAL_STATUS.FAILED
            }
            return newState;
        }
        case "IN_PROGRESS_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.filename] = {
                status: FILE_RETRIEVAL_STATUS.IN_PROGRESS,
                progress: action.payload.progress
            }
            return newState;
        }
        case "REMOVE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            delete newState.fileCacheMap[action.payload.filename];
            return newState;
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
    	default:
            return state;
    }
}

export default reducer;