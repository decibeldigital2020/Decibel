import React from 'react';
import {
    ALL_SUBSCRIPTIONS
} from '../constants/products';
import {
    ActivityIndicator,
    Alert,
    Button,
    Linking,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { styleConstants } from '../constants/styles';
import { 
    getAvailableSubscriptions as getAvailableSubscriptionsAction,
    requestNewSubscription as requestNewSubscriptionAction
} from '../actions/iapActions';
import { 
    getDescription, 
    getOriginalSubscriptionDate,
    getPrice,
    getRecentSubscriptionDate
} from '../util/subscriptionsUtil';

const HOW_TO_MANAGE_SUBSCRIPTION_TEXT = "To manage your subscription, open the Settings app. Tap your name, tap Subscriptions, then tap the subscription that you want to manage.";
const MANAGE_SUBSCRIPTION_LINK = "itms-apps://apps.apple.com/account/subscriptions";

const ActiveSubscription = ({activeSubscription, availableSubscriptions, getAvailableSubscriptions, requestingSubscriptions}) => {
    
    React.useEffect(() => {
        if ((!getAvailableSubscriptions || getAvailableSubscriptions.length === 0) && !requestingSubscriptions) {
            getAvailableSubscriptions();
        }
    }, []);

    const originalSubscriptionDate = getOriginalSubscriptionDate(activeSubscription);
    const recentSubscriptionDate = getRecentSubscriptionDate(activeSubscription);

    return <View style={styles.container}>
        <Text style={styles.headerText}>Active Subscription</Text>
        <View style={styles.optionsPanel}>
            <View 
                style={[styles.subscriptionOption, styles.subscriptionOptionSelected]}>
                <Text style={styles.subscriptionOptionTitle}>
                    { getDescription(activeSubscription.productId) }
                </Text>
                <Text style={styles.subscriptionOptionText}>
                    Original subscription date: { originalSubscriptionDate }
                </Text>
                { originalSubscriptionDate !== recentSubscriptionDate && 
                    <Text style={styles.subscriptionOptionText}>
                        Recent subscription date: { recentSubscriptionDate }
                    </Text>
                }
                { !requestingSubscriptions &&
                    <Text style={styles.subscriptionOptionText}>
                        { getPrice(availableSubscriptions, activeSubscription.productId) }
                    </Text>
                }
                { requestingSubscriptions &&
                    <ActivityIndicator size={"small"} color={styles.activityIndicator.color} style={styles.activityIndicator} />
                }
            </View>
        </View>
        <View style={[styles.subscribeButton, styles.subscribeButtonActive]}>
            <Button
                color={styleConstants.button.color}
                onPress={async () => {
                    const supported = await Linking.canOpenURL(MANAGE_SUBSCRIPTION_LINK);
                    if (supported) {
                        Linking.openURL(MANAGE_SUBSCRIPTION_LINK);
                    } else {
                        Alert.alert("Subscription", HOW_TO_MANAGE_SUBSCRIPTION_TEXT);
                    }
                }}
                title="Manage Subscription" />
        </View>
    </View>;
};

ActiveSubscription.defaultProps = {
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
    subscriptionOption: {
        backgroundColor: "#AAA",
        borderRadius: 12,
        margin: 12,
        padding: 12,
        borderStyle: "solid",
        borderWidth: 6,
        borderColor: "#000"
    },
    subscriptionOptionText: {
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
    activeSubscription: state.activeSubscription,
    availableSubscriptions: state.availableSubscriptions,
    requestingSubscriptions: state.requesting.subscriptions
});

const mapDispatchToProps = dispatch => ({
    getAvailableSubscriptions: () => dispatch(getAvailableSubscriptionsAction(ALL_SUBSCRIPTIONS)),
    requestNewSubscription: sku => dispatch(requestNewSubscriptionAction(sku))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveSubscription);