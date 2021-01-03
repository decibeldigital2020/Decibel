import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IssueList from './IssueList';
import ViewIssue from './ViewIssue';
import { styleConstants } from '../constants/styles';
import Icon from 'react-native-ionicons';
import Help from './Help';
import LogoTitle from './LogoTitle';
import Subscriptions from './Subscriptions';
import { connect } from 'react-redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const PreviewIssue = props => <ViewIssue previewOnly={true} {...props} />;
const Downloads = props => <IssueList downloadsOnly={true} {...props} />;
const OwnedIssues = props => <IssueList ownedOnly={true} {...props} />;

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

const SubscriptionsStack = (props) => 
  <Stack.Navigator
    screenOptions={screenOptions}>
    <Stack.Screen 
      name="SubscriptionsStack" 
      component={Subscriptions}
      options={{
        title: "Subscriptions",
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
      name="SubscriptionsStack"
      component={SubscriptionsStack}
      options={{
        tabBarLabel: 'Subscriptions',
        tabBarIcon: ({ color, size }) =>
          <Icon
            name="mail"
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
            name="folder-open"
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

const Navigation = ({currentVersion, clearCache, setVersion, version}) => {

  React.useEffect(() => {
    if (currentVersion !== version) {
      clearCache();
      setVersion(version);
    }
  }, [version]);

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  currentVersion: state.currentVersion
});

const mapDispatchToProps = dispatch => ({
  clearCache: () => dispatch({ type: "CLEAR_CACHE" }),
  setVersion: (version) => dispatch({ type: "VERSION", payload: version })
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);