import React from 'react';
import {
    View
} from 'react-native';
import { connect } from 'react-redux';
import NewSubscriptions from './NewSubscriptions';
import { ALL_SUBSCRIPTIONS } from '../constants/products';

const Subscriptions = ({ownedProducts}) => {
    const isSubscriptionProduct = product => ALL_SUBSCRIPTIONS.includes(product.productId);
    return <NewSubscriptions />;
}

const mapStateToProps = state => ({
    ownedProducts: state.ownedProducts
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);