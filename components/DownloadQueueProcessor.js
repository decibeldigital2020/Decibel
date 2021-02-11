import React from 'react';
import { connect } from 'react-redux';
import { FILE_RETRIEVAL_STATUS, MAX_INFLIGHT_DOWNLOADS, RESOURCE_TYPE } from '../constants';
import { getResource as getResourceAction } from '../actions/fileRetrievalActions';
import { getFilenameByResourceType } from '../util/fileRetrievalUtil';

const getInProgressDownloadCount = fileCacheMap => 
    Object.keys(fileCacheMap).filter(key => 
        fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.REQUESTED 
            || fileCacheMap[key].status === FILE_RETRIEVAL_STATUS.IN_PROGRESS).length;

const DownloadQueueProcessor = ({
    activeSubscription,
    downloadQueue, 
    fileCacheMap, 
    getResource, 
    issueList,
    ownedProducts,
    queuePop
}) => {
    console.log("downloadQueue", downloadQueue);

    const getIssueSku = resourceName => 
        (results => results && results[0] && results[0].sku)(issueList.issues.filter(issue => issue.upload_timestamp === resourceName))

    const getPurchase = resourceName => {
        if (!ownedProducts || !ownedProducts.length) {
            return null;
        }
        let index = ownedProducts.findIndex(product => product.productId === getIssueSku(resourceName));
        if (index !== -1) {
            return ownedProducts[index];
        } else {
            return activeSubscription;
        }
    }

    const getReceipt = (resourceName, resourceType) => 
        resourceType === RESOURCE_TYPE.ISSUE_IMG && 
            (purchase => purchase && purchase.transactionReceipt)(getPurchase(resourceName));

    React.useEffect(() => {
        if (getInProgressDownloadCount(fileCacheMap) < MAX_INFLIGHT_DOWNLOADS && downloadQueue.length > 0) {
            // More things are on the queue. Start downloading them.
            let next = downloadQueue[0];
            let existingEntry = fileCacheMap[getFilenameByResourceType(next.resourceName, next.resourceType, next.page)];
            if (!existingEntry || existingEntry.status === FILE_RETRIEVAL_STATUS.FAILED) {
                getResource(next.resourceName, 
                    next.resourceType, 
                    next.page, 
                    getReceipt(next.resourceName, next.resourceType));
            }
            queuePop(next);
        }
    }, [downloadQueue, fileCacheMap]);

    return null;
}

const mapStateToProps = state => ({
    activeSubscription: state.activeSubscription,
    downloadQueue: state.downloadQueue,
    fileCacheMap: state.fileCacheMap,
    issueList: state.issueList,
    ownedProducts: state.ownedProducts
});

const mapDispatchToProps = dispatch => ({
    getResource: (resourceName, resourceType, page, receipt) => 
        dispatch(getResourceAction(resourceName, resourceType, page, receipt)),
    queuePop: item => dispatch({ type: "DOWNLOAD_QUEUE_POP", payload: item })
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadQueueProcessor);