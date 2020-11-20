import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import { getIssueList } from '../actions/issueListActions';

const IssueList = ({ getIssueList, issueList, requestingIssueList }) => {

    React.useEffect(() => {
        if (!issueList && !requestingIssueList) {
            getIssueList();
        }
    }, []);

    const renderIssueListItem = (issue) =>
        <View style={styles.issueListItem}>
            <View style={styles.issueNumberContainer}>
                <Text style={styles.issueNumber}>{ issue.item.issue_number.toString() }</Text>
            </View>
            <View style={styles.issueInfoContainer}>
                <Text style={styles.displayDate}>{ issue.item.display_date }</Text>
                <Text style={styles.issueName}>{ issue.item.issue_name }</Text>
            </View>
        </View>;

    return (
        <View style={styles.container}>
            { issueList && !requestingIssueList && 
                <FlatList
                    style={styles.issueList}
                    data={issueList.issues}
                    renderItem={renderIssueListItem}
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

const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#CCCCCC"
    },
    displayDate: {
        fontWeight: "300"
    },
    issueInfoContainer: {
        flex: 1,
        flexDirection: "column"
    },
    issueList: {
        marginHorizontal: 16,
        marginTop: 16
    },
    issueListItem: {
        color: "#FF0000",
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        padding: 8,
        paddingLeft: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        marginVertical: 4
    },
    issueName: {
        fontWeight: "500"
    },
    issueNumberContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: 40
    },
    issueNumber: {
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