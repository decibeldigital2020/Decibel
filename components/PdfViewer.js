import React from 'react';
import Pdf from 'react-native-pdf';
import { StyleSheet } from 'react-native';

const PdfViewer = ({ resource }) => {

    const source = { uri: resource };

    return <Pdf
        enablePaging={false}
        horizontal={true}
        source={source}
        spacing={0}
        style={styles.container}
        onError={(error) => {
            console.error(error);
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