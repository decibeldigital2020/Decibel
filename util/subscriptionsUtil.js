import {
    ALL_SUBSCRIPTIONS,
    SUBSCRIPTION_SIX_MONTHS,
    SUBSCRIPTION_ONE_YEAR,
    SUBSCRIPTION_DESCRIPTIONS
} from '../constants/products';

export const getDescription = sku => SUBSCRIPTION_DESCRIPTIONS[sku] || "(This option is missing a description)";

export const getPrice = (availableSubscriptions, sku) => {
    if (!!availableSubscriptions && availableSubscriptions.length > 0) {
        let index = availableSubscriptions.findIndex(s => s.productId === sku);
        if (index !== -1) {
            return availableSubscriptions[index].localizedPrice;
        }
    }
    return "";
}

export const getOriginalSubscriptionDate = activeSubscription => {
    if (!!activeSubscription.originalTransactionDateIOS) {
        return new Date(activeSubscription.originalTransactionDateIOS).toLocaleDateString();
    }
    return "";
}

export const getRecentSubscriptionDate = activeSubscription => {
    if (!!activeSubscription.transactionDate) {
        return new Date(activeSubscription.transactionDate).toLocaleDateString();
    }
    return "";
}

export const getFirstUnlockedPublishTimestamp = (activeSubscription, issueList) => {
    if (!activeSubscription || !issueList || issueList.issues.length === 0) {
        return null;
    }
    let transactionDate = activeSubscription.transactionDate;
    let originalDate = activeSubscription.originalTransactionDateIOS;
    let subscriptionDate;
    if (typeof originalDate === 'number' && typeof transactionDate === 'number') {
        subscriptionDate = Math.min(active);
    } else if (typeof originalDate === 'number') {
        subscriptionDate = originalDate;
    } else {
        subscriptionDate = transactionDate;
    }
    let firstUnlockedIssueIndex = null;
    for(let index = 0; index < issueList.issues.length; index++) {
        let issue = issueList.issues[index];
        if (firstUnlockedIssueIndex !== null && new Date(issue.publish_timestamp).getTime() <= subscriptionDate) {
            firstUnlockedIssueIndex = index;
            break;
        }
    }
    if (!firstUnlockedIssueIndex) {
        firstUnlockedIssueIndex = issueList.issues.length - 1;
    }
    return new Date(issueList.issues[firstUnlockedIssueIndex].publish_timestamp).getTime();
}