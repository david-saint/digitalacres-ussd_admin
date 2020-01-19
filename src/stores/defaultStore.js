import {
  action,
  observable,
} from 'mobx';

export class DefaultStore {
  @observable appLoaded = false;

  @observable appName = 'USSD_ADMIN';

  @action setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new DefaultStore();
