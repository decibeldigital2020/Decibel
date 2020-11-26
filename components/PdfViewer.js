import React from 'react';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ resource }) => {

    const source = { uri: resource };

    return <Pdf
        source={source}
        style={{ flex: 1 }}
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

export default PdfViewer;