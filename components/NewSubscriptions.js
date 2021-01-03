import React from 'react';
import {
    ALL_SUBSCRIPTIONS
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
import AgreementsLinks from './AgreementsLinks';
import { 
    getAvailableSubscriptions as getAvailableSubscriptionsAction,
    requestNewSubscription as requestNewSubscriptionAction
} from '../actions/iapActions';
import { getDescription, getPrice } from '../util/subscriptionsUtil';

const FREE_MONTH_PROMO_TEXT = "First Month Free";
const FINE_PRINT = "Auto-renewing subscription begins after free trial period of one month. Can be cancelled at any time.";

const NewSubscriptions = ({availableSubscriptions, getAvailableSubscriptions, requestingSubscriptions, requestNewSubscription}) => {
    
    let [selectedSubscription, setSelectedSubscription] = React.useState(ALL_SUBSCRIPTIONS[0]);

    React.useEffect(() => {
        if ((!getAvailableSubscriptions || getAvailableSubscriptions.length === 0) && !requestingSubscriptions) {
            getAvailableSubscriptions();
        }
    }, []);

    return <View style={styles.container}>
        <Text style={styles.headerText}>Subscriptions</Text>
        <View style={styles.optionsPanel}>
            { ALL_SUBSCRIPTIONS.map(sku =>
                <TouchableOpacity 
                    key={`${sku}_subscription_option`}
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
                            { getPrice(availableSubscriptions, sku) }
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
                style={styleConstants.buttonStretch}
                title="Subscribe" />
        </View>
        <View style={styles.finePrint}>
            <Text style={styles.finePrintText}>
                { FINE_PRINT }
            </Text>
        </View>
        <AgreementsLinks />
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
        maxHeight: 200
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