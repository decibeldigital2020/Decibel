export const ENDPOINT_ISSUE_LIST_LAMBDA = "https://hg0yi3q9vb.execute-api.us-east-1.amazonaws.com/production/issuelist";
export const ENDPOINT_RESOURCE_LAMBDA = "https://f5md774521.execute-api.us-east-1.amazonaws.com/production/resource";
export const MANAGE_SUBSCRIPTIONS_URL_IOS = "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions";
export const FILE_RETRIEVAL_STATUS = {
    REQUESTED: "requested",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    FAILED: "failed"
};
export const RESOURCE_TYPE = {
    HERO: "hero",
    ISSUE: "issue",
    PREVIEW_IMG: "preview_img",
    PREVIEW_PDF: "preview_pdf"
};
export const MAX_PRESIGNED_URL_AGE = (5 * 60 * 1000) - (30 * 1000); // 5 minutes minus 30 seconds for network lag
export const MAX_ISSUE_LIST_AGE = (24 * 60 * 60 * 1000); // 1 day
export const HEROS_TO_PREFETCH = 10;
export const HEROS_TO_PREFETCH_URL = 15;
export const HERO_IMAGE_SCALE = 150;
export const HERO_IMAGE_RATIO = 1.34;
export const ISSUE_LIST_DESCRIPTION_LENGTH = 120;
export const ACCORDION_DURATION = 300;
export const MAX_PREVIEW_CACHE_SIZE = 5;