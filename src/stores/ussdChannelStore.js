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

  @observable structuresLoading = false;

  @observable channelRegistry = observable.map();

  @observable structures = [];

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
    if (!channel) return false;
    this.activeChannel = channel;
    return channel;
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

  @action loadStructures(id = null, page = 1, withRelations = false, clear = false) {
    this.structuresLoading = true;
    return ChannelService.structures(
      id || this.activeChannel.id,
      { page, with: withRelations || undefined },
    )
      .then(action(({ data }) => {
        if (clear) this.clearStructures();
        this.structures = data;
      }))
      .finally(action(() => { this.structuresLoading = false; }));
  }

  @action clearStructures() {
    this.structures = [];
  }
}

export default new UssdChannelStore();
