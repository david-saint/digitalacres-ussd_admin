import {
  action,
  computed,
  observable,
} from 'mobx';

import * as ChannelService from '../services/channelService';

export class UssdChannelStore {
  @observable page = 1;

  @observable activeChannel = null;

  @observable channelsLoading = false;

  @observable isLoading = false;

  @observable errorMessage = '';

  @observable channelRegistry = observable.map();

  @computed get channels() {
    return this.channelRegistry.values();
  }

  @computed get channelsArray() {
    return Array.from(this.channelRegistry);
  }

  getChannel(id) {
    return this.channelRegistry.get(id);
  }

  @action setPage(page) {
    this.page = page;
  }

  @action makeChannelActive(id) {
    const channel = this.getChannel(id);
    if (!channel) return Promise.reject(new Error('Channel does not exist'));
    this.activeChannel = channel;
    return Promise.resolve(channel);
  }

  @action loadAllChannels(withRelations = false) {
    this.channelsLoading = true;
    this.errorMessage = '';
    return ChannelService.index({
      page: this.page,
      with: withRelations || undefined,
    })
      .then(action(({ data }) => {
        this.channelRegistry.clear();
        data.forEach((c) => this.channelRegistry.set(c.id, c));
      }))
      .finally(action(() => { this.channelsLoading = false; }));
  }

  @action createChannel({ label, endpoint }) {
    this.isLoading = true;
    return ChannelService.create({ label, endpoint })
      .then(action(() => this.loadAllChannels()))
      .catch(action(({ response: { message } }) => {
        this.errorMessage = message;
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action saveChannel({ id, label, endpoint }) {
    this.isLoading = true;
    return ChannelService.update({ id, label, endpoint })
      .then(action(() => this.loadAllChannels()))
      .catch(action(({ response: { message } }) => {
        this.errorMessage = message;
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action deleteChannel(id) {
    this.isLoading = true;
    return ChannelService.deleteChannel(id)
      .then(action(() => this.loadAllChannels()))
      .finally(action(() => { this.isLoading = false; }));
  }
}

export default new UssdChannelStore();
