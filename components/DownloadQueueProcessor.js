import React from 'react';
import { connect } from 'react-redux';
import { FILE_RETRIEVAL_STATUS, MAX_INFLIGHT_DOWNLOADS } from '../constants';
import { getResource as getResourceAction } from '../actions/fileRetrievalActions';
import { getFilenameByResourceType } from '../util/fileRetrievalUtil';

const getInProgressDownloadCount = fileCacheMap => 
    Object.keys(fileCacheMap).filter(key => 
        fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.REQUESTED 
            || fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS).length;

const DownloadQueueProcessor = ({downloadQueue, fileCacheMap, getResource, queuePop}) => {
    console.log("downloadQueue", downloadQueue);
    
    React.useEffect(() => {
        if (getInProgressDownloadCount(fileCacheMap) < MAX_INFLIGHT_DOWNLOADS && downloadQueue.length > 0) {
            // More things are on the queue. Start downloading them.
            let next = downloadQueue[0];
            let existingEntry = fileCacheMap[getFilenameByResourceType(next.resourceName, next.resourceType, next.page)];
            if (!existingEntry || existingEntry.status === FILE_RETRIEVAL_STATUS.FAILED) {
                getResource(next.resourceName, 
                    next.resourceType, 
                    next.page, 
                    next.receipt);
            }
            queuePop(next);
        }
    }, [downloadQueue, fileCacheMap]);

    return null;
}

const mapStateToProps = state => ({
    downloadQueue: state.downloadQueue,
    fileCacheMap: state.fileCacheMap
});

const mapDispatchToProps = dispatch => ({
    getResource: (resourceName, resourceType, page, receipt) => 
        dispatch(getResourceAction(resourceName, resourceType, page, receipt)),
    queuePop: item => dispatch({ type: "DOWNLOAD_QUEUE_POP", payload: item })
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadQueueProcessor);