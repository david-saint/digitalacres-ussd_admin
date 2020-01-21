import {
  action,
  observable,
} from 'mobx';
import USSDCore from '../packages/ussd_core';
import ussdStructureStore from './ussdStrctureStore'; // eslint-disable-line

export default class UssdCoreStore {
  @observable structure = [];

  @observable _core = null;

  @observable core = null;

  @observable _active = null;

  @observable active = null;

  constructor(structure = []) {
    this.structure = structure;

    if (structure && structure.length === 0) {
      this._core = new USSDCore();
      this._core.add('', '', 'next');
    }

    if (structure && structure.length !== 0) {
      try {
        const c = USSDCore.deserialize(structure);
        if (c) {
          this._core = c;
        }
      } catch (e) { console.error(e); }
    }

    this.core = this._core.root.toObject();
  }

  @action updateActive(node) {
    this._active = node;
    this.active = node.toObject();
  }

  @action updateCore(node, withit = true) {
    this._core = USSDCore.createFromRoot(node);
    if (withit) {
      this.core = this._core.root.toObject();
    }
    return JSON.parse(USSDCore.serialize(this._core.root));
  }

  @action add() {
    this.makeNodeActive();
  }

  @action update(node) {
    const { value: { path } } = this._active;
    const c = {
      text: node.text || '',
      name: node.name || '',
      action: node.action || 'next',
    };

    if (node.isError) {
      const pad = path.split('|');
      c._id = 'errorNode';

      if (c.id !== '' && pad.length === 1) {
        c.path = 'errorNode';
      }

      if (pad.length > 1) {
        pad.pop();
        c.path = `${pad.join('|')}|errorNode`;
      }
    }

    this._core.edit(path, c);
    const structure = this.updateCore(this._core.root, false);
    return ussdStructureStore.updateStructure({ structure }, null, true)
      .then(action(() => this.updateCore(this._core.root)));
  }

  @action addChild() {
    const { value: { path } } = this._active;
    const [_, id] = this._core.add(path, '', 'next', 'New Node');
    const p = `${_.split('|') < 2 ? '' : `${_}|`}${id}`;
    const node = this._core.find(p);
    console.log(p, node, this._core.root.toObject());
    if (node) {
      this.updateActive(node);
      this.updateCore(this._core.root);
    }
  }

  @action deleteNode() {
    const { value: { path } } = this._active;
    if (path === '') return null;

    const pa = path.split('|');
    let newNode;

    if (pa.length === 1) {
      this._core.remove('', pa[0]);
      newNode = this._core.find('');
    } else {
      const id = pa.pop();
      this._core.remove(pa.join('|'), id);
      newNode = this._core.find(pa.join('|'));
    }

    if (newNode) {
      this.updateActive(newNode);
      const structure = this.updateCore(this._core.root, false);
      return ussdStructureStore.updateStructure({ structure }, null, true)
        .then(action(() => this.updateCore(this._core.root)));
    }

    return console.error(new Error('Could not delete the node. Come and beat me.'));
  }

  @action remove(parent, id) {
    this._core.remove(parent, id);
  }

  @action edit(id, options = {}) {
    this._core.edit(id, options);
  }

  @action makeNodeActive(path) {
    const n = this._core.find(path);
    if (!n) return console.log(path);
    this._active = n;
    this.active = n.toObject();
    return this.active;
  }
}
