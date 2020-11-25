import { ENDPOINT_RESOURCE_LAMBDA, RESOURCE_TYPE } from '../constants';
import RNFetchBlob from 'rn-fetch-blob';

export const getPreviewPdfFilename = uploadTimestamp => `${uploadTimestamp}_preview.pdf`;
export const getPreviewImageFilename = (uploadTimestamp, page) => `${uploadTimestamp}_preview-${page}.jpg`;
export const getHeroFilename = uploadTimestamp => `${uploadTimestamp}_hero-0.jpg`;
export const getIssueFilename = uploadTimestamp => `${uploadTimestamp}.pdf`;
export const getFilenameByResourceType = (uploadTimestamp, resourceType, page) => {
    switch (resourceType) {
        case RESOURCE_TYPE.HERO: {
            return getHeroFilename(uploadTimestamp);
        }
        case RESOURCE_TYPE.ISSUE: {
            return getIssueFilename(uploadTimestamp);
        }
        case RESOURCE_TYPE.PREVIEW_IMG: {
            return getPreviewImageFilename(uploadTimestamp, page);
        }
        case RESOURCE_TYPE.PREVIEW_PDF: {
            return getPreviewPdfFilename(uploadTimestamp);
        }
    }
}

export const getResource = (uploadTimestamp, resourceType, page) => dispatch => {
    let filename = getFilenameByResourceType(uploadTimestamp, resourceType);
    let data = {
        resource_type: resourceType,
        resource_name: uploadTimestamp
    };
    if (page) {
        data.page = page;
    }
    console.log("Fetching " + ENDPOINT_RESOURCE_LAMBDA, data, filename);
    dispatch({ type: "REQUEST_FILE_CACHE", payload: { filename } });
    fetch(ENDPOINT_RESOURCE_LAMBDA, {
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST"
    }).then(response => {
        console.log("Received response", response);
        if (response.status !== 200) {
            console.log("Status not 200", response.status);
            throw new Error(response);
        }
        return response.json();
    }).then(responseJson => {
        console.log("Response json", responseJson);
        if (!responseJson.url) {
            console.log("No url in response");
            throw new Error(responseJson);
        }
        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
            path : dirs.DownloadDir + "/" + filename
        })
        .fetch('GET', responseJson.url)
        .progress({ count : 10 }, (received, total) => {
            console.log('progress', received / total);
            dispatch({
                type: "IN_PROGRESS_FILE_CACHE",
                payload: {
                    filename,
                    progress: (received / total)
                }
            });
        })
        .then((resourceResponse) => {
            console.log('Got resource response', resourceResponse);
            dispatch({
                type: "COMPLETE_FILE_CACHE",
                payload: {
                    filename,
                    localPath: resourceResponse.path()
                }
            });
            // TODO handle delete files: https://www.npmjs.com/package/rn-fetch-blob#user-content-cache-file-management
        })
    }).catch(err => {
        console.log("Error fetching resource", err);
        dispatch({ type: "FAIL_FILE_CACHE", payload: { filename }});
    });
} 