import { action, observable } from 'mobx';
import UssdCoreStore from './ussdCoreStore'; // eslint-disable-line
import ussdChannelStore from './ussdChannelStore';
import * as StructureService from '../services/structureService';

export class UssdStructureStore {
  @observable isLoading = false;

  @observable structure = null;

  @observable structureRegistry = observable.map();

  @observable ussdCore = null;

  @observable actions = [];

  @action getStructure(id, withRelations = false, force = false) {
    this.isLoading = true;
    const structure = this.structureRegistry.get(id);
    if (structure && !force) {
      this.structure = structure;
      this.isLoading = false;
      this.ussdCore = new UssdCoreStore(structure.structure);
      return Promise.resolve(structure);
    }
    return StructureService.get(id, { with: withRelations })
      .then(action(({ data }) => {
        this.structure = data;
        this.structureRegistry.set(data.id, data);
        this.ussdCore = new UssdCoreStore(data.structure);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action createStructure({ label }, channelId = null) {
    const structure = [];
    const channel = channelId || ussdChannelStore.activeChannel.id;
    this.isLoading = true;
    return StructureService.create(
      channelId || ussdChannelStore.activeChannel.id,
      { label, structure },
    )
      .then(action(() => ussdChannelStore.loadStructures(channel)))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action updateStructure(structure, id = null, force = false) {
    this.isLoading = true;
    return StructureService.update({
      label: structure.label,
      id: id || this.structure.id,
      structure: structure.structure || undefined,
    })
      .then(action(() => {
        if (id === null) this.getStructure(this.structure.id, false, force);
        else ussdChannelStore.loadStructures(ussdChannelStore.activeChannel.id);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action activateStructure(id = null) {
    this.isLoading = true;
    return StructureService.activate(id || this.structure.id)
      .then(action(() => {
        ussdChannelStore.loadStructures(
          ussdChannelStore.activeChannel.id,
          1,
          false,
          true,
        );
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action deleteStructure(id = null) {
    this.isLoading = true;
    return StructureService.deleteStructure(id || this.structure.id)
      .then(action(() => {
        if (id === null) { this.structure = null; }
        ussdChannelStore.loadStructures(ussdChannelStore.activeChannel.id);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action loadActions() {
    this.isLoading = true;
    return StructureService.actions()
      .then(action(({ data }) => {
        this.actions = data;
      }))
      .finally(action(() => { this.isLoading = false; }));
  }
}

export default new UssdStructureStore();
