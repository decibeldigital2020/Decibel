import React from 'react';
import {
    View
} from 'react-native';
import { connect } from 'react-redux';
import ActiveSubscription from './ActiveSubscription';
import NewSubscriptions from './NewSubscriptions';
import { ALL_SUBSCRIPTIONS } from '../constants/products';

const Subscriptions = ({activeSubscription}) => {
    if (!!activeSubscription) {
        return <ActiveSubscription />;
    }
    return <NewSubscriptions />;
}

const mapStateToProps = state => ({
    activeSubscription: state.activeSubscription
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);