import { ENDPOINT_ISSUE_LIST_LAMBDA, HEROS_TO_PREFETCH, HEROS_TO_PREFETCH_URL, RESOURCE_TYPE } from "../constants";
import { getResource, getResourceLink } from './fileRetrievalActions';
import { getAvailableProducts } from './iapActions';

export const getIssueList = () => (dispatch) => {
    const getIssueListErrorMessage = "There was a problem getting the list of issues. Try again in a few minutes.";

    dispatch({
        type: "REQUESTING",
        payload: {
            name: "issueList",
            value: true
        }
    });
    //console.log("Fetching " + ENDPOINT_ISSUE_LIST_LAMBDA);
    fetch(ENDPOINT_ISSUE_LIST_LAMBDA, {
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        //console.log("Completed issue list request", response);
        dispatch({
            type: "REQUESTING",
            payload: {
                name: "issueList",
                value: false
            }
        });
        if (response.status !== 200) {
            throw new Error(response);
        } else {
            return response.json();
        }
    }).then(responseJson => {
        //console.log("Returning issue list json", responseJson);
        dispatch({
            type: "ISSUE_LIST",
            payload: responseJson
        });
        // Pre-fetch first 10 issue heros
        responseJson.issues.slice(0, HEROS_TO_PREFETCH).forEach(issue => 
            dispatch(getResource(issue.upload_timestamp, RESOURCE_TYPE.HERO))
        );

        // Pre-fetch next 15 hero urls
        responseJson.issues.slice(HEROS_TO_PREFETCH, HEROS_TO_PREFETCH + HEROS_TO_PREFETCH_URL).forEach(issue => 
            dispatch(getResourceLink(issue.upload_timestamp, RESOURCE_TYPE.HERO))
        );

        // Fetch apple store product info
        dispatch(getAvailableProducts(responseJson.issues.map(issue => issue.sku)));
    }).catch(err => {
        //console.log(err);
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