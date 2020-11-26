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
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const persistedReducerConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistedReducerConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
persistor.purge();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
        </PersistGate>
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
