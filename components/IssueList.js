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
import IssueListItem from './IssueListItem';
import { MAX_ISSUE_LIST_AGE } from '../constants';
import SplashScreen from 'react-native-splash-screen';
import { getIssueFilename } from '../util/fileRetrievalUtil';

const issueListIsAlive = issueListRequestedTimestamp => (issueListRequestedTimestamp + MAX_ISSUE_LIST_AGE) >= Date.now();

const IssueList = ({ downloadsOnly, fileCacheMap, getIssueList, issueList, issueListRequestedTimestamp, navigation, ownedOnly, requestingIssueList }) => {

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

    if (!issueList) {
        return null;
    }

    let data = !!downloadsOnly 
        ? issueList.issues.filter(issue => Object.keys(fileCacheMap).includes(getIssueFilename(issue.upload_timestamp)))
        : (!!ownedOnly
            ? issueList.issues
            : issueList.issues);

    return (
        <View style={styles.container}>
            { issueList && 
                <FlatList
                    style={styles.issueList}
                    data={data}
                    onRefresh={() => getIssueList()}
                    refreshing={requestingIssueList}
                    renderItem={(issue) => 
                        <IssueListItem 
                            controlAccordion={[0, 1, 2].map(i => issueList.issues[i].product_id).includes(issue.item.product_id)}
                            downloadView={!!downloadsOnly}
                            issue={issue.item} 
                            navigation={navigation} 
                            owned={!!ownedOnly}
                            />}
                    keyExtractor={issue => issue.issue_number.toString()}
                    showsVerticalScrollIndicator={false}
                />
            }
            { issueList && !!downloadsOnly && data.length === 0 &&
                <View style={styles.noDownloads}>
                    <Text style={styles.noDownloadsText}>
                        You have no downloaded issues yet.
                    </Text>
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
        backgroundColor: "#000",
        flexDirection: "column",
        justifyContent: "flex-end"
    },
    issueList: {
        marginHorizontal: 16
    },
    noDownloads: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    noDownloadsText: {
        color: "#FFF",
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 20,
        marginLeft: "auto",
        marginRight: "auto"
    }
});

IssueList.defaultProps = {
    getIssueList: () => {console.log("getIssueList not implemented")},
    issueList: null,
    requestingIssueList: false
}

const mapStateToProps = (state) => ({
    fileCacheMap: state.fileCacheMap,
    issueList: state.issueList,
    issueListRequestedTimestamp: state.issueListRequestedTimestamp,
    requestingIssueList: state.requesting.issueList
});

const mapDispatchToProps = () => dispatch => ({
    getIssueList: () => dispatch(getIssueList())
})

export default connect(mapStateToProps, mapDispatchToProps)(IssueList);