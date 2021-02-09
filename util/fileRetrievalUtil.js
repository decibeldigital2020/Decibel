import { RESOURCE_TYPE, MAX_PRESIGNED_URL_AGE } from '../constants';

const getResourceErrorMessage = "There was a problem downloading the requested item. Please try again in a few minutes.";

export const getPreviewPdfFilename = uploadTimestamp => `${uploadTimestamp}_preview.pdf`;
export const getPreviewImageFilename = (uploadTimestamp, page) => `${uploadTimestamp}_preview-${page}.jpg`;
export const getHeroFilename = uploadTimestamp => `${uploadTimestamp}_hero-0.jpg`;
export const getIssueFilename = uploadTimestamp => `${uploadTimestamp}.pdf`;
export const getIssueImageFilename = (uploadTimestamp, page) => `${uploadTimestamp}_issue-${page}.jpg`;

export const getFilenameByResourceType = (uploadTimestamp, resourceType, page) => {
    switch (resourceType) {
        case RESOURCE_TYPE.HERO: {
            return getHeroFilename(uploadTimestamp);
        }
        case RESOURCE_TYPE.ISSUE: {
            return getIssueFilename(uploadTimestamp);
        }
        case RESOURCE_TYPE.ISSUE_IMG: {
            return getIssueImageFilename(uploadTimestamp, page);
        }
        case RESOURCE_TYPE.PREVIEW_IMG: {
            return getPreviewImageFilename(uploadTimestamp, page);
        }
        case RESOURCE_TYPE.PREVIEW_PDF: {
            return getPreviewPdfFilename(uploadTimestamp);
        }
    }
};

export const presignedUrlIsAlive = (requestedTimestamp) =>
    (requestedTimestamp + MAX_PRESIGNED_URL_AGE) <= Date.now();


export const getFilenameFromUrl = (url) => {
    const regex = /\/[0-9]+(_[a-zA-Z0-9-]+){0,1}\.[a-zA-Z]{3}\?/gm;
    const result = url.match(regex);
    return result && result[0].slice(1, result[0].length - 1);
}