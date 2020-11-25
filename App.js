/**
 * Decibel magazine app for iOs
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
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

const Stack = createStackNavigator();
const store = createStore(reducer, applyMiddleware(thunk));

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen 
              name="IssueList" 
              component={IssueList}
              options={{
                title: "Issues"
              }} />
            <Stack.Screen 
              name="PreviewIssue" 
              component={PreviewIssue}
              options={{
                title: "Preview"
              }} />
          </Stack.Navigator>
        </SafeAreaView>
      </Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  }
});

export default App;
