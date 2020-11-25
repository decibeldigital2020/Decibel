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

// TODO: Refresh on re-open app
const IssueList = ({ getIssueList, issueList, navigation, requestingIssueList }) => {

    React.useEffect(() => {
        if (!issueList && !requestingIssueList) {
            getIssueList();
        }
    }, []);

    return (
        <View style={styles.container}>
            { issueList && !requestingIssueList && 
                <FlatList
                    style={styles.issueList}
                    data={issueList.issues}
                    renderItem={(issue) => <IssueListItem issue={issue.item} navigation={navigation} />}
                    keyExtractor={issue => issue.issue_number.toString()}
                    showsVerticalScrollIndicator={false}
                />
            }
            { requestingIssueList &&
                <View style={styles.activityIndicator}>
                    <ActivityIndicator 
                        size={"large"}
                        color={"#000000"} 
                    />
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
        backgroundColor: "#CCC"
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
    requestingIssueList: state.requesting.issueList
});

const mapDispatchToProps = () => dispatch => ({
    getIssueList: () => dispatch(getIssueList())
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);