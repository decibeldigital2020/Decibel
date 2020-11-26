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

const issueListIsAlive = issueListRequestedTimestamp => (issueListRequestedTimestamp + MAX_ISSUE_LIST_AGE) >= Date.now();

// TODO: Refresh on re-open app
const IssueList = ({ getIssueList, issueList, issueListRequestedTimestamp, navigation, requestingIssueList }) => {

    React.useEffect(() => {
        if ((!issueList || !issueListIsAlive(issueListRequestedTimestamp)) && !requestingIssueList) {
            getIssueList();
        }
    }, []);

    return (
        <View style={styles.container}>

            { issueList && 
                <FlatList
                    style={styles.issueList}
                    data={issueList.issues}
                    onRefresh={() => getIssueList()}
                    refreshing={requestingIssueList}
                    renderItem={(issue) => <IssueListItem issue={issue.item} navigation={navigation} />}
                    keyExtractor={issue => issue.issue_number.toString()}
                    showsVerticalScrollIndicator={false}
                />
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
        backgroundColor: "#000"
    },
    issueList: {
        marginHorizontal: 16,
        marginTop: 16
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