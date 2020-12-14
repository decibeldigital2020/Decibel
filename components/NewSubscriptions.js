import React from 'react';
import {
    ALL_SUBSCRIPTIONS,
    SUBSCRIPTION_SIX_MONTHS,
    SUBSCRIPTION_ONE_YEAR
} from '../constants/products';
import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { styleConstants } from '../constants/styles';
import { 
    getAvailableSubscriptions as getAvailableSubscriptionsAction,
    requestNewSubscription as requestNewSubscriptionAction
} from '../actions/iapActions';

const FREE_MONTH_PROMO_TEXT = "First Month Free";

const SUBSCRIPTION_DESCRIPTIONS = {
    [SUBSCRIPTION_ONE_YEAR]: "1 Year Subscription",
    [SUBSCRIPTION_SIX_MONTHS]: "6 Month Subscription"
}

const NewSubscriptions = ({availableSubscriptions, getAvailableSubscriptions, requestingSubscriptions, requestNewSubscription}) => {
    
    let [selectedSubscription, setSelectedSubscription] = React.useState(SUBSCRIPTION_ONE_YEAR);

    React.useEffect(() => {
        if ((!getAvailableSubscriptions || getAvailableSubscriptions.length === 0) && !requestingSubscriptions) {
            getAvailableSubscriptions();
        }
    }, []);

    const getDescription = sku => SUBSCRIPTION_DESCRIPTIONS[sku];

    const getPrice = sku => {
        if (!availableSubscriptions || availableSubscriptions.length === 0) {
            return "";
        }
        let index = availableSubscriptions.findIndex(s => s.productId === sku);
        if (index !== -1) {
            return availableSubscriptions[index].localizedPrice;
        }
    }

    return <View style={styles.container}>
        <Text style={styles.headerText}>Subscriptions</Text>
        <View style={styles.optionsPanel}>
            { ALL_SUBSCRIPTIONS.map(sku =>
                <TouchableOpacity 
                    onPress={() => 
                        setSelectedSubscription(sku)}
                    style={[
                        styles.subscriptionOption,
                        selectedSubscription === sku && styles.subscriptionOptionSelected
                    ]}>
                    <Text style={styles.subscriptionOptionTitle}>
                        { getDescription(sku) }
                    </Text>
                    <Text style={styles.subscriptionOptionPrice}>
                        { FREE_MONTH_PROMO_TEXT }
                    </Text>
                    { !requestingSubscriptions &&
                        <Text style={styles.subscriptionOptionPrice}>
                            { getPrice(sku) }
                        </Text>
                    }
                    { requestingSubscriptions &&
                        <ActivityIndicator size={"small"} color={styles.activityIndicator.color} style={styles.activityIndicator} />
                    }
                </TouchableOpacity>
            ) }
        </View>
        <View style={[styles.subscribeButton, selectedSubscription ? styles.subscribeButtonActive : styles.subscribeButtonPassive]}>
            <Button
                color={styleConstants.button.color} 
                disabled={!selectedSubscription}
                onPress={() => requestNewSubscription(selectedSubscription)}
                title="Subscribe" />
        </View>
        <View style={styles.finePrint}>
            <Text style={styles.finePrintText}>
                Auto-renewing subscription begins after free trial period of one month. Can be cancelled at any time.
            </Text>
        </View>
    </View>;
};

NewSubscriptions.defaultProps = {
    requestingSubscriptions: false
};

const styles = StyleSheet.create({
    activityIndicator: {
        color: "#333"
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        backgroundColor: "#000"
    },
    finePrint: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
        marginTop: 12,
    },
    finePrintText: {
        color: "#FFF",
        margin: 12
    },
    headerText: {
        fontWeight: "800",
        fontSize: 24,
        marginBottom: 12,
        marginTop: 12,
        color: "#FFF",
        marginLeft: "auto",
        marginRight: "auto"
    },
    optionsPanel: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    subscribeButton: {
        borderRadius: 6,
        margin: 12,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 40
    },
    subscribeButtonActive: {
        backgroundColor: styleConstants.actionButton.color
    },
    subscribeButtonPassive: {
        backgroundColor: styleConstants.passiveButton.color,
    },
    subscriptionOption: {
        backgroundColor: "#AAA",
        borderRadius: 12,
        margin: 12,
        padding: 12,
        borderStyle: "solid",
        borderWidth: 6,
        borderColor: "#000"
    },
    subscriptionOptionPrice: {
        fontWeight: "400",
        fontSize: 18,
        marginBottom: 6,
        marginLeft: 12
    },
    subscriptionOptionSelected: {
        backgroundColor: "#FFF",
        borderStyle: "solid",
        borderWidth: 6,
        borderColor: styleConstants.actionButton.color,
        margin: 12,
        padding: 12
    },
    subscriptionOptionTitle: {
        fontWeight: "600",
        fontSize: 22,
        marginBottom: 6,
        marginLeft: 12
    }
});

const mapStateToProps = state => ({
    availableSubscriptions: state.availableSubscriptions,
    requestingSubscriptions: state.requesting.subscriptions
});

const mapDispatchToProps = dispatch => ({
    getAvailableSubscriptions: () => dispatch(getAvailableSubscriptionsAction(ALL_SUBSCRIPTIONS)),
    requestNewSubscription: sku => dispatch(requestNewSubscriptionAction(sku))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewSubscriptions);