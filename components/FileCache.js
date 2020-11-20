import React from 'react';
import { connect } from 'react-redux';

const FileCache = ({
    appCache,
    beginFileCache,
    completeFileCache,
    failFileCache,
    removeFileCache
}) => {
    let [requestQueue, setRequestQueue] = React.useState([]);

    const addRequestToQueue = key => {
        let newQueue = [...requestQueue];
        newQueue.push(key);
        setRequestQueue(newQueue);
    }

    const removeRequestFromQueue = key => {
        let newQueue = [...requestQueue];
        let index = newQueue.findIndex(k => k === key);
        index !== -1 && newQueue.splice(index, 1);
        setRequestQueue(newQueue);
    }

    const handleFileCacheRequest = key => {
        addRequestToQueue(key);
    }

    React.useEffect(() => {
        Object.keys(appCache).forEach(key => {
            if (appCache[key].status === "requested" && !requestQueue.includes(key)) {
                handleFileCacheRequest(key);
            }
        });
    }, [appCache]);

    return null;
};


const mapStateToProps = state => ({
    appCache: state.fileCacheMap
});

const mapDispatchToProps = dispatch => ({
    beginFileCache: (key) => {},
    completeFileCache: (key, localPath) => {},
    failFileCache: (key) => {},
    removeFileCache: (key) => {}
});

export default connect(mapStateToProps, mapDispatchToProps)(FileCache);


/*
type Props = {
  appCache: FileCacheMap;
  // These functions wrap around the Redux `dispatch` function, as you'll see in the container component.
  beginFileCache: (url: string) => void;
  completeFileCache: (originalUrl: string, localUrl: string) => void;
  failFileCache: (url: string) => void;
  removeFileCache: (url: string) => void;
};

type State = {
  requestQueue: string[];
};

export class FileCache extends PureComponent {
  state: State = {
    requestQueue: [],
  };

  render() {
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const changedKeys = cacheDiff(prevProps.appCache, this.props.appCache);
    changedKeys.forEach(key => {
      const value = this.props.appCache[key];
      if (value && value.type === "FileCacheRequested") {
        if (!requestQueueContainsKey(this.state.requestQueue, key)) {
          this.handleFileCacheRequest(key);
        }
      } 
    });
  }

  handleFileCacheRequest(url: string) {
    this.addRequestToQueue(url);
    RNFetchBlob.config({
      path: RNFetchBlob.fs.dirs.DocumentDir + "/" + localFilenameForUrl(url),
    })
      .fetch("GET", url)
      .then(result => {
        this.props.completeFileCache(url, result.path());
        this.removeRequestFromQueue(url);
      })
      .catch(error => {
        this.props.failFileCach(url);
        this.removeRequestFromQueue(url);
      });
  }

  addRequestToQueue(url: string) {
    const newQueue = this.state.requestQueue.concat([url])
    this.setState({
      requestQueue: newQueue,
    });
  }

  removeRequestFromQueue(url: string): void {
    const newQueue = this.state.requestQueue.filter(el => el !== element);
    this.setState({
      requestQueue: newQueue,
    });
  }
}*/