/**
 * Decibel magazine app for iOs
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import reducer from './reducer';
import { applyMiddleware, createStore } from 'redux';
import thunk from "redux-thunk";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IssueList from './components/IssueList';
import PreviewIssue from './components/PreviewIssue';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import decibelLogoHeaderImage from './img/decibel-header-logo.png';
import { styleConstants } from './constants/styles';

const persistedReducerConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistedReducerConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
if(__DEV__) {
  persistor.purge();
}

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: styleConstants.statusBar.backgroundColor
};
const headerTintColor = styleConstants.statusBar.color;
const headerTitleStyle = {
  fontWeight: "500"
};

const LogoTitle = () => {
  return <Image source={decibelLogoHeaderImage} style={styles.decibelLogoHeaderImage} />
}

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
            <Stack.Navigator
              screenOptions={{
                headerStyle,
                headerTintColor,
                headerTitleStyle
              }}>
              <Stack.Screen 
                name="IssueList" 
                component={IssueList}
                options={{
                  title: "Issues",
                  headerTitle: props => <LogoTitle {...props} />
                }} />
              <Stack.Screen 
                name="PreviewIssue" 
                component={PreviewIssue}
                options={{
                  title: "Preview"
                }} />
            </Stack.Navigator>
          </SafeAreaView>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000"
  },
  decibelLogoHeaderImage: {
    width: 96,
    height: 16
  }
});

export default App;
