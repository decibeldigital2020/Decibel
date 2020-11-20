import React from 'react';
import PDFView from 'react-native-view-pdf/lib/index';
import { View, Text } from "react-native" ;

const resources = {
  url: 'http://www.africau.edu/images/default/sample.pdf'
};

export default class PdfViewer extends React.Component {
  render() {
    const resourceType = 'url';
    console.log("test")
    return (
        <PDFView
          fadeInDuration={0}
          style={{ flex: 1 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
    );
  }
}