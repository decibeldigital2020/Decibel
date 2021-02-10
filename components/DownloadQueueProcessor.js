import React from 'react';
import { connect } from 'react-redux';
import { FILE_RETRIEVAL_STATUS, MAX_INFLIGHT_DOWNLOADS } from '../constants';
import { getResource as getResourceAction } from '../actions/fileRetrievalActions';

const getInProgressDownloadCount = fileCacheMap => 
    Object.keys(fileCacheMap).filter(key => 
        fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.REQUESTED 
            || fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS).length;

const DownloadQueueProcessor = ({downloadQueue, queuePop, queuePush}) => {
    
    React.useEffect(() => {
        if (getInProgressDownloadCount(fileCacheMap) < MAX_INFLIGHT_DOWNLOADS && downloadQueue.length > 0) {
            // More things are on the queue. Start downloading them.
            let nextItemToDownload = downloadQueue[0];
            getResource(nextItemToDownload.resourceName, 
                nextItemToDownload.resourceType, 
                nextItemToDownload.page, 
                nextItemToDownload.receipt);
            queuePop(nextItemToDownload);
        }
    }, [downloadQueue]);

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