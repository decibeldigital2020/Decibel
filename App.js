/**
 * Decibel magazine app for iOs
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import reducer from './reducer';
import { applyMiddleware, createStore } from 'redux';
import thunk from "redux-thunk";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { styleConstants } from './constants/styles';
import InAppPurchaseHandler from './components/InAppPurchaseHandler';
import ProcessingTransaction from './components/ProcessingTransaction';
import Navigation from './components/Navigation';

const persistedReducerConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistedReducerConfig, reducer);
let store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const App = ({build, version}) => {

  const getFullVersion = () => (version + '.' + build);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
          { !__DEV__ && <InAppPurchaseHandler /> }
          <Navigation
            version={getFullVersion()} />
          <ProcessingTransaction />
        </SafeAreaView>
      </PersistGate>
    </Provider>
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