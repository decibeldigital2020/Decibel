import React from 'react';
import { Linking, Text } from 'react-native';
import { styleConstants } from '../constants/styles';

const ErrorHelperText = ({}) => {
    return <Text 
        onPress={() => Linking.openURL("https://www.decibelmagazine.com/about/staff/")}
        style={styleConstants.errorHelperText}>
        Click here to contact Decibel for further assistance.
    </Text>;
}

export default ErrorHelperText;