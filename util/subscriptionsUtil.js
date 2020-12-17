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
    let subscriptionDate = activeSubscription.originalTransactionDateIOS;
    let firstUnlockedIssueIndex;
    issueList.map((issue, index) => {
        if (!index && new Date(issue.publish_timestamp).getTime() <= subscriptionDate) {
            firstUnlockedIssueIndex = index;
        }
    });
    if (!firstUnlockedIssueIndex) {
        firstUnlockedIssueIndex = issueList.length - 1;
    }
    return new Date(issueList[firstUnlockedIssueIndex].publish_timestamp).getTime();
}