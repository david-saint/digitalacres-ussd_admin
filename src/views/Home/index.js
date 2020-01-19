import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { PrimaryButton } from 'office-ui-fabric-react';

import ChannelItem from './ChannelItem';
import ChannelDialog from './ChannelDialog';
import Loader from '../../components/Loader/index';

import './index.css';
import logo from '../../assets/logo.svg';

@inject('defaultStore', 'ussdChannelStore')
@observer
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      dialogTitle: '',
      dialogVisible: false,
    };
  }

  componentDidMount() {
    const { ussdChannelStore } = this.props;
    ussdChannelStore.loadAllChannels();
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  }

  showCreateDialog = () => {
    this.setState({ id: null, dialogVisible: true, dialogTitle: 'Create Channel' });
  }

  showEditDialog = (id) => {
    this.setState({ id, dialogVisible: true, dialogTitle: 'Edit Channel' });
  }

  hideDialog = () => {
    this.setState({ dialogVisible: false });
  }

  render() {
    const { id, dialogTitle, dialogVisible } = this.state;
    const { defaultStore, ussdChannelStore } = this.props;

    return (
      <div className="HomeContain">
        <img src={logo} className="logo-image" alt={defaultStore.appName} />
        <div className="flx-r">
          <h3>Channels</h3>
          <PrimaryButton
            text="Create Channel"
            onClick={this.showCreateDialog}
          />
        </div>
        <div className="channel-list">
          {
            ussdChannelStore.channelsLoading
              ? (<Loader />)
              : ussdChannelStore.channelsArray.map(([key, value]) => (
                <ChannelItem
                  key={key}
                  channel={value}
                  onEditItem={() => this.showEditDialog(key)}
                  onDeleteItem={() => ussdChannelStore.deleteChannel(key)}
                />
              ))
          }
        </div>
        <ChannelDialog
          id={id}
          isDraggable
          title={dialogTitle}
          hidden={!dialogVisible}
          hideDialog={this.hideDialog}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  defaultStore: PropTypes.object.isRequired, // eslint-disable-line
  ussdChannelStore: PropTypes.object.isRequired, // eslint-disable-line
};

export default HomePage;
