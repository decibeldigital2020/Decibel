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
import { styleConstants } from './constants/styles';
import Icon from 'react-native-ionicons';
import Help from './components/Help';
import LogoTitle from './components/LogoTitle';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PreviewIssue = props => <ViewIssue previewOnly={true} {...props} />;
const Downloads = props => <IssueList downloadsOnly={true} {...props} />;
const OwnedIssues = props => <IssueList ownedOnly={true} {...props} />;

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
  </Stack.Navigator>;

const HelpStack = (props) => 
  <Stack.Navigator
    screenOptions={screenOptions}>
    <Stack.Screen
      name="Help"
      component={Help}
      options={{
        title: "Help",
        headerTitle: LogoTitle
      }} />
  </Stack.Navigator>;

const RootTabNavigator = (props) =>
  <Tab.Navigator
    backBehavior={"none"}
    initialRouteName="IssueList"
    tabBarOptions={tabBarOptions}>
    <Tab.Screen
      name="IssueListStack"
      component={IssueListStack}
      options={{
        tabBarLabel: 'Issues',
        tabBarIcon: ({ color, size }) =>
          <Icon
            name="paper"
            color={color}
            size={size}
          />,
        unmountOnBlur: true
      }} />
    <Tab.Screen
      name="LibraryStack"
      component={LibraryStack}
      options={{
        tabBarLabel: 'Library',
        tabBarIcon: ({ color, size }) =>
          <Icon
            name="paper"
            color={color}
            size={size}
          />,
        unmountOnBlur: true
      }} />
    <Tab.Screen
      name="DownloadsStack"
      component={DownloadsStack}
      options={{
        tabBarLabel: 'Downloads',
        tabBarIcon: ({ color, size }) =>
          <Icon
            name="cloud-download"
            color={color}
            size={size}
          />,
        unmountOnBlur: true
      }} />
    <Tab.Screen
      name="HelpStack"
      component={HelpStack}
      options={{
        tabBarLabel: 'Help',
        tabBarIcon: ({ color, size }) => 
          <Icon
            name="help"
            color={color}
            size={size}
          />,
        unmountOnBlur: true
      }} />
  </Tab.Navigator>;

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
            <Stack.Navigator>
              <Stack.Screen
                name="RootTabNavigator"
                component={RootTabNavigator}
                options={{
                  title: "Decibel",
                  headerShown: false
                }} />
              <Stack.Screen 
                name="PreviewIssue" 
                component={PreviewIssue}
                options={{
                  title: "Preview",
                  headerShown: false
                }} />
              <Stack.Screen 
                name="ViewIssue" 
                component={ViewIssue}
                options={{
                  title: "View Issue",
                  headerShown: false
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
  }
});

export default App;