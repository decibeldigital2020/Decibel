import React from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';
import decibelLogoHeaderImage from '../img/decibel-header-logo.png';

const LogoTitle = props => <Image source={decibelLogoHeaderImage} style={styles.decibelLogoHeaderImage} />;

const styles = StyleSheet.create({
  decibelLogoHeaderImage: {
    width: 96,
    height: 16
  }
});

export default LogoTitle;