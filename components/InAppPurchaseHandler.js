import React from 'react';
import {
    Platform,
    View
} from 'react-native';
import {
  endConnection,
  finishTransaction,
  finishTransactionIOS,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import { connect } from 'react-redux';
import { 
    processFailedPurchase as processFailedPurchaseAction,
    processNewPurchase as processNewPurchaseAction 
} from '../actions/iapActions';

const InAppPurchaseHandler = ({processFailedPurchase, processNewPurchase}) => {

    let purchaseUpdatedListenerRef;
    let purchaseErrorListenerRef;
    
    React.useEffect(() => {
        initConnection()
            .then(() => {
                purchaseUpdatedListenerRef = purchaseUpdatedListener((purchase) => {
                    if (purchase.transactionReceipt) {
                        finishTransaction(purchase, false)
                            .then(() => {
                                processNewPurchase(purchase);
                            })
                            .catch(err => {
                                processFailedPurchase();
                                console.error('purchaseUpdatedListener', err);
                            });
                    }
                });
                purchaseErrorListenerRef = purchaseErrorListener((err) => {
                    processFailedPurchase();
                    console.error('purchaseErrorListener', err);
                });
            })
            .catch(err => {
                console.error('initConnection', err);
            });
        return (() => {
            if (purchaseUpdatedListenerRef) {
                purchaseUpdatedListenerRef.remove();
                purchaseUpdatedListenerRef = null;
            }
            if (purchaseErrorListenerRef) {
                purchaseErrorListenerRef.remove();
                purchaseErrorListenerRef = null;
            }
            endConnection();
        });
    }, []);

    return null;
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    processFailedPurchase: () => dispatch(processFailedPurchaseAction()),
    processNewPurchase: purchase => dispatch(processNewPurchaseAction(purchase))
});

export default connect(mapStateToProps, mapDispatchToProps)(InAppPurchaseHandler);