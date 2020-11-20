const initialState = {
    fileCacheMap: {
        /*
         * filename: {
         *   status: oneOf: [requested, in_progress, completed, failed],
         *   localPath: string
         * }
         */
    },
    issueList: null,
    requesting: {
        /*
         * name: oneOf: [true, false]
         */
    }
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
            let cacheEntry = Object.assign({}, fileCacheMap[key]);
            if (!!cacheEntry && (cacheEntry.status === "in_progress" || cacheEntry.status === "completed")) {
            	return state;
            }
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.key] = { status: "requested" };
            return newState;
        }
        case "COMPLETE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.key] = {
            	status: "completed",
            	localPath: action.payload.localPath
            }
            return newState;
        }
        case "FAIL_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            newState.fileCacheMap[action.payload.key] = {
            	status: "failed"
            }
            return newState;
        }
        case "REMOVE_FILE_CACHE": {
            newState.fileCacheMap = Object.assign({}, newState.fileCacheMap);
            delete newState.fileCacheMap[key];
            return newState;
        }
    	default:
            return state;
    }
}

export default reducer;