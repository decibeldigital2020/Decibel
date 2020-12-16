import React from 'react';
import {
    Button,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { styleConstants } from '../constants/styles';
import {
    restorePurchases as restorePurchasesAction
} from '../actions/iapActions';

const RestorePurchasesButton = ({ restorePurchases }) => {

    return <View style={styles.restorePurchasesButton}>
        <Button
            color={styleConstants.button.color}
            onPress={restorePurchases}
            title="Restore Purchases" 
        />
    </View>;
}

const styles = StyleSheet.create({
    restorePurchasesButton: {
        borderRadius: 6,
        margin: 12,
        flex: 1,
        flexDirection: "row",
        maxHeight: 40,
        backgroundColor: styleConstants.passiveButton.color,
    },
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    restorePurchases: () => dispatch(restorePurchasesAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(RestorePurchasesButton);