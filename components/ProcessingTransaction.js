import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    View
} from 'react-native';
import { connect } from 'react-redux';
import LogoTitle from './LogoTitle';

const ProcessingTransaction = ({processingTransaction, requesting}) => {

    const isModalVisible = () => !!processingTransaction || !!requesting.purchases;

    return <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible()}
        onRequestClose={() => {}}>
        <View style={styles.modal}>
            <View style={styles.logoTitle}>
                <LogoTitle style={styles.logoTitleImage} />
            </View>
            <ActivityIndicator size={"large"} color={styles.activityIndicator.color} style={styles.activityIndicator} />
        </View>
    </Modal>;
}

ProcessingTransaction.defaultProps = {
    processingTransaction: false
};

const styles = StyleSheet.create({
    activityIndicator: {
        color: "#DDD",
        marginBottom: 10
    },
    logoTitle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 50,
        marginTop: 50
    },
    modal: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60,
        backgroundColor: "#000"
    }
});

const mapStateToProps = state => ({
    processingTransaction: state.processingTransaction,
    requesting: state.requesting
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ProcessingTransaction);