import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { initializeIcons } from '@uifabric/icons';
import { Switch, Route, withRouter } from 'react-router-dom';

import Home from './views/Home/index';
import Editor from './views/Editor/index';
import Loader from './components/Loader/index';

initializeIcons();

@inject('defaultStore', 'ussdChannelStore')
@withRouter
@observer
class App extends Component {
  componentDidMount() {
    const { defaultStore, ussdChannelStore } = this.props;
    if (!defaultStore.appLoaded) {
      ussdChannelStore
        .loadAllChannels()
        .then(() => defaultStore.setAppLoaded());
    }
  }

  renderLoader = () => (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader />
    </div>
  )

  render() {
    const { defaultStore } = this.props;

    if (!defaultStore.appLoaded) {
      return this.renderLoader();
    }

    return (
      <Switch>
        <Route path="/editor" component={Editor} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}

App.propTypes = {
  defaultStore: PropTypes.shape({
    appLoaded: PropTypes.bool.isRequired,
    setAppLoaded: PropTypes.func.isRequired,
  }).isRequired,
  ussdChannelStore: PropTypes.shape({
    loadAllChannels: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
