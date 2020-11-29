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
import { getIssueList } from '../actions/issueListActions';
import Icon from 'react-native-ionicons';
import IssueListItem from './IssueListItem';
import { MAX_ISSUE_LIST_AGE } from '../constants';
import BottomNavigation from './BottomNavigation';
import SplashScreen from 'react-native-splash-screen'

const issueListIsAlive = issueListRequestedTimestamp => (issueListRequestedTimestamp + MAX_ISSUE_LIST_AGE) >= Date.now();

const IssueList = ({ getIssueList, issueList, issueListRequestedTimestamp, navigation, requestingIssueList }) => {

    React.useEffect(() => {
        if ((!issueList || !issueListIsAlive(issueListRequestedTimestamp)) && !requestingIssueList) {
            getIssueList();
        }
    }, []);

    React.useEffect(() => {
        if (!!issueList) {
            SplashScreen.hide();
        }
    }, [issueList])

    return (
        <View style={styles.container}>
            { issueList && 
                <FlatList
                    style={styles.issueList}
                    data={issueList.issues}
                    onRefresh={() => getIssueList()}
                    refreshing={requestingIssueList}
                    renderItem={(issue) => 
                        <IssueListItem 
                            controlAccordion={[0, 1, 2].map(i => issueList.issues[i].product_id).includes(issue.item.product_id)}
                            issue={issue.item} 
                            navigation={navigation} 
                            />}
                    keyExtractor={issue => issue.issue_number.toString()}
                    showsVerticalScrollIndicator={false}
                />
            }
            <BottomNavigation navigation={navigation} />
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
    }
});

IssueList.defaultProps = {
    getIssueList: () => {console.log("getIssueList not implemented")},
    issueList: null,
    requestingIssueList: false
}

const mapStateToProps = (state) => ({
    issueList: state.issueList,
    issueListRequestedTimestamp: state.issueListRequestedTimestamp,
    requestingIssueList: state.requesting.issueList
});

const mapDispatchToProps = () => dispatch => ({
    getIssueList: () => dispatch(getIssueList())
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);