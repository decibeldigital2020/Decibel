import { RESOURCE_TYPE, MAX_PRESIGNED_URL_AGE } from '../constants';

const getResourceErrorMessage = "There was a problem downloading the requested item. Please try again in a few minutes.";

export const getPreviewPdfFilename = resourceName => `${resourceName}_preview.pdf`;
export const getPreviewImageFilename = (resourceName, page) => `${resourceName}_preview-${page}.jpg`;
export const getPreviewImagePrefix = (resourceName) => `${resourceName}_preview-`;
export const getHeroFilename = resourceName => `${resourceName}_hero-0.jpg`;
export const getIssueFilename = resourceName => `${resourceName}.pdf`;
export const getIssueImageFilename = (resourceName, page) => `${resourceName}_issue-${page}.jpg`;
export const getIssueImagePrefix = (resourceName) => `${resourceName}_issue-`;

export const getFilenameByResourceType = (resourceName, resourceType, page) => {
    switch (resourceType) {
        case RESOURCE_TYPE.HERO: {
            return getHeroFilename(resourceName);
        }
        case RESOURCE_TYPE.ISSUE: {
            return getIssueFilename(resourceName);
        }
        case RESOURCE_TYPE.ISSUE_IMG: {
            return getIssueImageFilename(resourceName, page);
        }
        case RESOURCE_TYPE.PREVIEW_IMG: {
            return getPreviewImageFilename(resourceName, page);
        }
        case RESOURCE_TYPE.PREVIEW_PDF: {
            return getPreviewPdfFilename(resourceName);
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