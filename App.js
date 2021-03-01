/**
 * Decibel magazine app for iOs
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  Dimensions,
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
import DownloadQueueProcessor from './components/DownloadQueueProcessor';
import OrientationListener from './components/OrientationListener';
import { ORIENTATIONS } from './constants';

const persistedReducerConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistedReducerConfig, reducer);
let store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const App = ({build, version}) => {

  const [orientation, setOrientation] = React.useState(null);

  React.useEffect(() => {
    const window = Dimensions.get('window');
    if (window.height > window.width) {
      setOrientation(ORIENTATIONS.PORTRAIT);
    } else {
      setOrientation(ORIENTATIONS.LANDSCAPE);
    }
  });

  const onLayout = (e) => {
    const {width, height} = Dimensions.get('window');
    if (height > width) {
      setOrientation(ORIENTATIONS.PORTRAIT);
    } else {
      setOrientation(ORIENTATIONS.LANDSCAPE);
    }
  }

  const getFullVersion = () => (version + '.' + build);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container} onLayout={onLayout}>
          <StatusBar barStyle="light-content" backgroundColor={styleConstants.statusBar.backgroundColor} />
          { !__DEV__ && <InAppPurchaseHandler /> }
          <Navigation
            version={getFullVersion()} />
          <ProcessingTransaction />
          <DownloadQueueProcessor />
          <OrientationListener orientation={orientation} />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#000"
  }
});

export default App;