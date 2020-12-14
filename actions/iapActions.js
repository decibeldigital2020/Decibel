import {
    getAvailablePurchases,
    getProducts,
    getSubscriptions,
    requestPurchase, 
    requestSubscription 
} from 'react-native-iap';

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
            // console.log(products);
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
            // console.log(subscriptions);
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
            console.log(result);
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
            console.log(result);
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
            console.log(result);
            dispatch({
                type: "RESTORE_PURCHASES",
                payload: result
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