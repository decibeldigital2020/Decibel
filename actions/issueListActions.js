import { ENDPOINT_ISSUE_LIST_LAMBDA } from "../constants";

export const getIssueList = () => (dispatch) => {
    const getIssueListErrorMessage = "There was a problem getting the list of issues. Try again in a few minutes.";

    dispatch({
        type: "REQUESTING",
        payload: {
            name: "issueList",
            value: true
        }
    });
    console.log("Fetching " + ENDPOINT_ISSUE_LIST_LAMBDA);
    fetch(ENDPOINT_ISSUE_LIST_LAMBDA, {
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        console.log("Completed issue list request", response);
        dispatch({
            type: "REQUESTING",
            payload: {
                name: "issueList",
                value: false
            }
        });
        if (response.status !== 200) {
            dispatch({
                type: "ERROR",
                payload: {
                    message: getIssueListErrorMessage
                }
            });
            throw new Error(response);
        } else {
            return response.json();
        }
    }).then(responseJson => {
        console.log("Returning issue list json", responseJson);
        dispatch({
            type: "ISSUE_LIST",
            payload: responseJson
        });
    }).catch(err => {
        console.log(err);
        dispatch({
            type: "REQUESTING",
            payload: {
                name: "issueList",
                value: false
            }
        });
        dispatch({
            type: "ERROR",
            payload: {
                message: getIssueListErrorMessage
            }
        });
    });
}