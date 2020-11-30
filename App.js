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
import BottomNavigation from './components/BottomNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const persistedReducerConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistedReducerConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
// if(__DEV__) {
//   persistor.purge();
// }

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const activeTintColor = "#E44";
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

const PreviewIssue = props => <ViewIssue previewOnly={true} {...props} />;
const Downloads = props => <IssueList downloadsOnly={true} {...props} />;
const OwnedIssues = props => <IssueList ownedOnly={true} {...props} />;
const Help = props => <IssueList {...props} />;

const IssuesListStack = (props) => <Stack.Navigator
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
      title: "Preview",
      headerTitle: props => <LogoTitle {...props} />
    }} />
  <Stack.Screen 
    name="ViewIssue" 
    component={ViewIssue}
    options={{
      title: "View Issue",
      headerTitle: props => <LogoTitle {...props} />
    }} />
</Stack.Navigator>;

const DownloadsStack = (props) => <Stack.Navigator
  screenOptions={{
    headerStyle,
    headerTintColor,
    headerTitleStyle
  }}>
  <Stack.Screen 
    name="Downloads" 
    component={Downloads}
    options={{
      title: "Downloads",
      headerTitle: props => <LogoTitle {...props} />
    }} />
  <Stack.Screen 
    name="PreviewIssue" 
    component={PreviewIssue}
    options={{
      title: "Preview",
      headerTitle: props => <LogoTitle {...props} />
    }} />
  <Stack.Screen 
    name="ViewIssue" 
    component={ViewIssue}
    options={{
      title: "View Issue",
      headerTitle: props => <LogoTitle {...props} />
    }} />
</Stack.Navigator>;

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
            <Text>Test</Text>
          </SafeAreaView>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

/*
<Tab.Navigator
              initialRouteName="IssueList"
              tabBarOptions={{
                activeTintColor
              }}>
              <Tab.Screen
                name="IssuesListStack"
                component={IssueListStack}
                options={{
                  tabBarLabel: 'Issues',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={size}
                    />
                  ),
                }}  />
              <Tab.Screen
                name="DownloadsStack"
                component={DownloadsStack}
                options={{
                  tabBarLabel: 'Downloads',
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="settings"
                      color={color}
                      size={size}
                    />
                  ),
                }} />
            </Tab.Navigator>
*/

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
