import React from 'react';
import PDFView from 'react-native-view-pdf/lib/index';

const PdfViewer = ({ resource }) => {

    const splitPath = resource.split("/");
    const filename = resource;//splitPath[splitPath.length - 1];

    return <PDFView
        fadeInDuration={0}
        style={{ flex: 1 }}
        resource={filename}
        resourceType={"file"}
        onLoad={() => console.log(`PDF rendered from file`)}
        onError={(error) => console.log('Cannot render PDF', filename, error)}
    />;
};

export default PdfViewer;