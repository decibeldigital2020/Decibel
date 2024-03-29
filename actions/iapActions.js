import {
    getAvailablePurchases as getAvailablePurchasesAction,
    getProducts as getProductsAction,
    getSubscriptions as getSubscriptionsAction,
    requestPurchase as requestPurchaseAction, 
    requestSubscription as requestSubscriptionAction 
} from 'react-native-iap';
import { ALL_SUBSCRIPTIONS } from '../constants/products';
import {
    availablePurchasesMock,
    availableSubscriptionsMock,
    getAvailableProductsMock,
    getNewPurchaseMock
} from '../mocks/iapMocks';

let getAvailablePurchases;
let getProducts;
let getSubscriptions;
let requestPurchase;
let requestSubscription;

if (__DEV__) {
    getAvailablePurchases = () => new Promise((res, rej) => res(availablePurchasesMock));
    getProducts = (skuList) => new Promise((res, rej) => res(getAvailableProductsMock(skuList)));
    getSubscriptions = (skuList) => new Promise((res, rej) => res(availableSubscriptionsMock));
    requestPurchase = (sku) => new Promise((res, rej) => {
        processNewPurchase(getNewPurchaseMock(sku));
        res();
    });
    requestSubscription = (sku) => new Promise((res, rej) => {
        processNewPurchase(getNewPurchaseMock(sku));
        res();
    });
} else {
    getAvailablePurchases = getAvailablePurchasesAction;
    getProducts = getProductsAction;
    getSubscriptions = getSubscriptionsAction;
    requestPurchase = requestPurchaseAction;
    requestSubscription = requestSubscriptionAction;
}

export const getAvailableProducts = (skuList) => dispatch => {
    dispatch({
        type: "REQUESTING",
        payload: {
            name: "products",
            value: true
        }
    });  
    getProducts(skuList)
        .then(products => {
            // // console.log(products);
            dispatch({
                type: "AVAILABLE_PRODUCTS",
                payload: products
            });
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "products",
                    value: false
                }
            });
        })
        .catch(err => {
            console.error("getProducts", err);
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "products",
                    value: false
                }
            });
        });
}

export const getAvailableSubscriptions = (skuList) => dispatch => {
    dispatch({
        type: "REQUESTING",
        payload: {
            name: "subscriptions",
            value: true
        }
    });  
    getSubscriptions(skuList)
        .then(subscriptions => {
            // // console.log(subscriptions);
            dispatch({
                type: "AVAILABLE_SUBSCRIPTIONS",
                payload: subscriptions
            });
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "subscriptions",
                    value: false
                }
            });
        })
        .catch(err => {
            console.error("getSubscriptions", err);
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "subscriptions",
                    value: false
                }
            });
        });
}

export const processFailedPurchase = () => dispatch => {
    dispatch({
        type: "PROCESSING_TRANSACTION",
        payload: false
    });
}

export const processNewPurchase = purchase => dispatch => {
    dispatch({
        type: "PURCHASE",
        payload: {
            sku: purchase.productId,
            purchase
        }
    });
    if (ALL_SUBSCRIPTIONS.includes(purchase.productId)) {
        dispatch({
            type: "ACTIVE_SUBSCRIPTION",
            payload: purchase
        });
    }
    dispatch({
        type: "PROCESSING_TRANSACTION",
        payload: false
    });
}

export const requestNewPurchase = sku => dispatch => {
    dispatch({
        type: "PROCESSING_TRANSACTION",
        payload: true
    });
    requestPurchase(sku)
        .then(result => {
            //// console.log(result);
        })
        .catch(err => {
            console.error("requestPurchase", err);
            dispatch({
                type: "PROCESSING_TRANSACTION",
                payload: false
            });
        })
}

export const requestNewSubscription = sku => dispatch => {
    dispatch({
        type: "PROCESSING_TRANSACTION",
        payload: true
    });
    requestSubscription(sku)
        .then(result => {
            //// console.log(result);
        })
        .catch(err => {
            console.error("requestSubscription", err);
            dispatch({
                type: "PROCESSING_TRANSACTION",
                payload: false
            });
        })
}

export const restorePurchases = () => dispatch => {
    dispatch({
        type: "REQUESTING",
        payload: {
            name: "purchases",
            value: true
        }
    });
    getAvailablePurchases()
        .then(result => {
            // // console.log(result);
            dispatch({
                type: "RESTORE_PURCHASES",
                payload: result
            });
            let foundActiveSubscription = false;
            ALL_SUBSCRIPTIONS.map(sku => {
                if (foundActiveSubscription) {
                    return;
                }
                let index = result.findIndex(p => p.productId === sku);
                if (index !== -1) {
                    dispatch({
                        type: "ACTIVE_SUBSCRIPTION",
                        payload: result[index]
                    });
                    foundActiveSubscription = true;
                }
            });
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "purchases",
                    value: false
                }
            });
        })
        .catch(err => {
            console.error('restorePurchases', err);
            dispatch({
                type: "REQUESTING",
                payload: {
                    name: "purchases",
                    value: false
                }
            });
        });
}