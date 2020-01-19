import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { initializeIcons } from '@uifabric/icons';
import { Switch, Route, withRouter } from 'react-router-dom';

import Home from './views/Home/index';
import Editor from './views/Editor/index';

initializeIcons();

@inject('defaultStore')
@withRouter
@observer
class App extends Component {
  componentDidMount() {
    const { defaultStore } = this.props;
    if (!defaultStore.appLoaded) {
      defaultStore.setAppLoaded();
    }
  }

  render() {
    const { defaultStore } = this.props;

    if (!defaultStore.appLoaded) {
      return (<h1>Loading..</h1>);
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
};

export default App;
