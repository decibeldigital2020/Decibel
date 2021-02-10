export const ENDPOINT_ISSUE_LIST_LAMBDA = "https://hg0yi3q9vb.execute-api.us-east-1.amazonaws.com/production/issuelist";
export const ENDPOINT_RESOURCE_LAMBDA = "https://f5md774521.execute-api.us-east-1.amazonaws.com/production/resource";
export const MANAGE_SUBSCRIPTIONS_URL_IOS = "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions";
export const DECIBEL_HELP_URL = "https://www.decibelmagazine.com/about/staff/";
export const PRIVACY_POLICY_URL = "https://www.decibelmagazine.com/app-privacy/";
export const TERMS_OF_SERVICE_URL = "https://www.decibelmagazine.com/terms-and-conditions-for-decibel-magazine-app/";
export const FILE_RETRIEVAL_STATUS = {
    REQUESTED: "requested",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    FAILED: "failed",
    NOT_STARTED: "not_started"
};
export const RESOURCE_TYPE = {
    HERO: "hero",
    ISSUE: "issue",             // Deprecated issue PDF
    ISSUE_IMG: "issue_img",     // New issue JPGs by page
    PREVIEW_IMG: "preview_img",
    PREVIEW_PDF: "preview_pdf"
};
export const MAX_PRESIGNED_URL_AGE = (5 * 60 * 1000) - (30 * 1000); // 5 minutes minus 30 seconds for network lag
export const MAX_ISSUE_LIST_AGE = (24 * 60 * 60 * 1000); // 1 day
export const HEROS_TO_PREFETCH = 20;
export const HERO_IMAGE_SCALE = 150;
export const HERO_IMAGE_RATIO = 1.34;
export const ISSUE_LIST_DESCRIPTION_LENGTH = 120;
export const ACCORDION_DURATION = 300;
export const MAX_PREVIEW_CACHE_SIZE = 5;
export const NUMBER_OF_PREVIEW_PAGES = 15;
export const MAX_INFLIGHT_DOWNLOADS = 10;