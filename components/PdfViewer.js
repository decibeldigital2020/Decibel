import React from 'react';
import Pdf from 'react-native-pdf';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

const PdfViewer = ({ cacheKey, failFileCache, resource }) => {

    const source = { uri: resource };

    return <Pdf
        enablePaging={false}
        horizontal={true}
        source={source}
        spacing={0}
        style={styles.container}
        onError={(error) => {
            console.error("PdfViewer", error);
            failFileCache(cacheKey);
        }}
    />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    failFileCache: (filename) => dispatch({ type: "FAIL_FILE_CACHE", payload: { filename }})
})

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer);