import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('defaultStore')
@observer
class EditorPage extends Component {
  render() {
    return <h1>This is the Editor Page.</h1>;
  }
}

export default EditorPage;
