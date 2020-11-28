import React from 'react';
import Pdf from 'react-native-pdf';
import { StyleSheet } from 'react-native';

const PdfViewer = ({ resource }) => {

    const source = { uri: resource };

    return <Pdf
        horizontal={true}
        source={source}
        style={styles.container}
        onLoadComplete={(numberOfPages, filePath) => {
            //console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page,numberOfPages) => {
            //console.log(`current page: ${page}`);
        }}
        onError={(error) => {
            //console.log(error);
        }}
    />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    }
});

export default PdfViewer;