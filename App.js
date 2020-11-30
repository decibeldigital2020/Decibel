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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IssueList from './components/IssueList';
import ViewIssue from './components/ViewIssue';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import decibelLogoHeaderImage from './img/decibel-header-logo.png';
import { styleConstants } from './constants/styles';
import Icon from 'react-native-ionicons';

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
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: styleConstants.statusBar.backgroundColor },
  headerTintColor: styleConstants.statusBar.color,
  headerTitleStyle: { fontWeight: "500" }
};

const tabBarOptions = {
  activeBackgroundColor: styleConstants.statusBar.backgroundColor,
  activeTintColor: styleConstants.iconLight.color,
  inactiveBackgroundColor: styleConstants.statusBar.backgroundColor,
  inactiveTintColor: styleConstants.iconMedium.color,
  labelStyle: { fontWeight: "500" },
  keyboardHidesTabBar: true,
  style: {
    backgroundColor: styleConstants.statusBar.backgroundColor
  }
};

const LogoTitle = props => <Image source={decibelLogoHeaderImage} style={styles.decibelLogoHeaderImage} />;
const PreviewIssue = props => <ViewIssue previewOnly={true} {...props} />;
const Downloads = props => <IssueList downloadsOnly={true} {...props} />;
const OwnedIssues = props => <IssueList ownedOnly={true} {...props} />;
const Help = props => <IssueList {...props} />;

const IssueListStack = (props) => 
  <Stack.Navigator
    screenOptions={screenOptions}>
    <Stack.Screen 
      name="IssueList" 
      component={IssueList}
      options={{
        title: "Issues",
        headerTitle: LogoTitle
      }} />
    <Stack.Screen 
      name="PreviewIssue" 
      component={PreviewIssue}
      options={{
        title: "Preview",
        headerTitle: LogoTitle
      }} />
    <Stack.Screen 
      name="ViewIssue" 
      component={ViewIssue}
      options={{
        title: "View Issue",
        headerTitle: LogoTitle
      }} />
  </Stack.Navigator>;

const DownloadsStack = (props) => 
  <Stack.Navigator
    screenOptions={screenOptions}>
    <Stack.Screen 
      name="Downloads" 
      component={Downloads}
      options={{
        title: "Downloads",
        headerTitle: LogoTitle
      }} />
    <Stack.Screen 
      name="ViewIssue" 
      component={ViewIssue}
      options={{
        title: "View Issue",
        headerTitle: LogoTitle
      }} />
  </Stack.Navigator>;

const LibraryStack = (props) => 
  <Stack.Navigator
    screenOptions={screenOptions}>
    <Stack.Screen 
      name="Library" 
      component={OwnedIssues}
      options={{
        title: "Library",
        headerTitle: LogoTitle
      }} />
    <Stack.Screen 
      name="PreviewIssue" 
      component={PreviewIssue}
      options={{
        title: "Preview",
        headerTitle: LogoTitle
      }} />
    <Stack.Screen 
      name="ViewIssue" 
      component={ViewIssue}
      options={{
        title: "View Issue",
        headerTitle: LogoTitle
      }} />
  </Stack.Navigator>;

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
            <Tab.Navigator
              backBehavior={"none"}
              initialRouteName="IssueList"
              tabBarOptions={tabBarOptions}>
              <Tab.Screen
                name="IssueListStack"
                component={IssueListStack}
                options={{
                  tabBarLabel: 'Issues',
                  tabBarIcon: ({ color, size }) => (
                    <Icon
                      name="paper"
                      color={color}
                      size={size}
                    />
                  ),
                }}  />
              <Tab.Screen
                name="LibraryStack"
                component={LibraryStack}
                options={{
                  tabBarLabel: 'Library',
                  tabBarIcon: ({ color, size }) => (
                    <Icon
                      name="paper"
                      color={color}
                      size={size}
                    />
                  ),
                }} />
              <Tab.Screen
                name="DownloadsStack"
                component={DownloadsStack}
                options={{
                  tabBarLabel: 'Downloads',
                  tabBarIcon: ({ color, size }) => (
                    <Icon
                      name="cloud-download"
                      color={color}
                      size={size}
                    />
                  ),
                }} />
            </Tab.Navigator>
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
