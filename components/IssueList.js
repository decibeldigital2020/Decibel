import React from 'react';
import {
    ActivityIndicator,
    Animated,
    Button,
    Easing,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { getIssueList as getIssueListAction } from '../actions/issueListActions';
import IssueListItem from './IssueListItem';
import { MAX_ISSUE_LIST_AGE } from '../constants';
import SplashScreen from 'react-native-splash-screen';
import { getIssueFilename } from '../util/fileRetrievalUtil';
import {
    ALL_SUBSCRIPTIONS
} from '../constants/products';
import {
    getAvailableProducts as getAvailableProductsAction,
    getAvailableSubscriptions as getAvailableSubscriptionsAction
} from '../actions/iapActions';

const issueListIsAlive = issueListRequestedTimestamp => 
    (issueListRequestedTimestamp + MAX_ISSUE_LIST_AGE) >= Date.now();

const IssueList = ({ 
    availableProducts,
    availableSubscriptions,
    downloadsOnly, 
    fileCacheMap, 
    getAvailableProducts,
    getAvailableSubscriptions,
    getIssueList, 
    issueList, 
    issueListRequestedTimestamp, 
    navigation, 
    ownedOnly, 
    ownedProducts,
    requestingIssueList,
    requestingProducts,
    requestingSubscriptions
}) => {

    React.useEffect(() => {
        if ((!issueList || !issueListIsAlive(issueListRequestedTimestamp)) && !requestingIssueList) {
            getIssueList();
        }
    }, []);

    React.useEffect(() => {
        if (!!issueList && !requestingProducts && (!availableProducts || availableProducts.length === 0)) {
            getAvailableProducts(issueList.issues.map(issue => issue.sku));
        }
    }, [issueList]);

    React.useEffect(() => {
        if (!!availableProducts && availableProducts.length > 0) {
            SplashScreen.hide();
            if ((!availableSubscriptions || availableSubscriptions.length === 0) && !requestingSubscriptions) {
                getAvailableSubscriptions();
            }
        }
    }, [availableProducts]);

    if (!issueList) {
        return null;
    }

    const data = !!downloadsOnly 
        ? issueList.issues.filter(issue => Object.keys(fileCacheMap).includes(getIssueFilename(issue.upload_timestamp)))
        : (!!ownedOnly
            ? issueList.issues
            : issueList.issues);

    const getProduct = (issue) => {
        if (!availableProducts || availableProducts.length === 0) {
            return null;
        }
        let index = availableProducts.findIndex(p => p.productId === issue.sku);
        if (index !== -1) {
            return availableProducts[index];
        }
    }

    const getPurchase = issue => {
        if (!ownedProducts) {
            return null;
        }
        if (ownedProducts[issue.sku]) {
            return ownedProducts[issue.sku];
        } else {
            return null; // TODO return subscription receipt
        }
    }

    const subscriptionIncludesIssue = (issue) => false;

    const isIssueOwned = (issue) => 
        Object.keys(ownedProducts).includes(issue.sku) || subscriptionIncludesIssue(issue);

    return (
        <View style={styles.container}>
            { issueList && 
                <FlatList
                    style={styles.issueList}
                    data={data}
                    onRefresh={() => getIssueList()}
                    refreshing={requestingIssueList}
                    renderItem={(issue) => 
                        <IssueListItem 
                            controlAccordion={[0, 1, 2].map(i => issueList.issues[i].product_id).includes(issue.item.product_id)}
                            downloaded={!!downloadsOnly}
                            issue={issue.item} 
                            navigation={navigation} 
                            owned={!!ownedOnly || isIssueOwned(issue.item)}
                            product={getProduct(issue.item)}
                            purchase={getPurchase(issue.item)}
                            />}
                    keyExtractor={issue => issue.issue_number.toString()}
                    showsVerticalScrollIndicator={false}
                />
            }
            { issueList && !!downloadsOnly && data.length === 0 &&
                <View style={styles.noDownloads}>
                    <Text style={styles.noDownloadsText}>
                        You have no downloaded issues yet.
                    </Text>
                </View>
            }
        </View>
    );
}

const styleConstants = {
    buttonColor: "#FFF"
}

const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#000",
        flexDirection: "column",
        justifyContent: "flex-end"
    },
    issueList: {
        marginHorizontal: 16
    },
    noDownloads: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    noDownloadsText: {
        color: "#FFF",
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 20,
        marginLeft: "auto",
        marginRight: "auto"
    }
});

IssueList.defaultProps = {
    issueList: null,
    requestingIssueList: false,
    requestingProducts: false,
    requestingSubscriptions: false
}

const mapStateToProps = (state) => ({
    availableProducts: state.availableProducts,
    availableSubscriptions: state.availableSubscriptions,
    fileCacheMap: state.fileCacheMap,
    issueList: state.issueList,
    issueListRequestedTimestamp: state.issueListRequestedTimestamp,
    ownedProducts: state.ownedProducts,
    requestingIssueList: state.requesting.issueList,
    requestingProducts: state.requesting.products,
    requestingSubscriptions: state.requesting.subscriptions
});

const mapDispatchToProps = () => dispatch => ({
    getAvailableProducts: (skuList) => dispatch(getAvailableProductsAction(skuList)),
    getAvailableSubscriptions: () => dispatch(getAvailableSubscriptionsAction(ALL_SUBSCRIPTIONS)),
    getIssueList: () => dispatch(getIssueListAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);