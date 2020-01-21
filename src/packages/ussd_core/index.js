import uuid from 'uuid/v4';

import Node from './node';
import Queue from '../queue';
import valueStub from './stubs/value';

export default class USSDCore {
  /**
   * Initialize the class with an empty
   * root node and a template for creating values.
   * @return {void}
   */
  constructor() {
    this.root = null;
    this._valueTemplate = valueStub;
  }

  /**
   * The marker constant
   */
  static get MARKER() { return {}; }

  /**
   * Method for determining if something is a marker
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  static isMarker(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  /**
   * Create a new USSDcore from a root node..
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  static createFromRoot(node) {
    const n = new USSDCore();
    n.__root = node;

    return n;
  }

  /**
   * Setter for the root
   * @param  {[type]} n [description]
   * @return {[type]}   [description]
   */
  set __root(n) { this.root = n; }

  /**
   * Add an element to the api
   * @param  {string}      parent  [A pipe, "|", seperated list of ids]
   * @param  {string}      text    [The string you want to be displayed in the ussd]
   * @param  {Array|null}  action  [The action to be performed with the request]
   * @return {array}              [The new pipe seperated list to find the added node]
   */
  add(parent, text, action = null, name = '', hid = null) {
    // if this is the first item they're adding
    if (this.root === null) return this._createFirstNode(text, action);

    // find the parent
    const p = this.find(parent);
    // if We didn't find the parent return false
    if (p === false) return false;

    // generate a unique id for the new node
    const id = uuid();
    const path = `${parent.split('|') < 2 ? '' : `${parent}|`}${id}`;
    // create a value for it.
    const v = {
      ...this._valueTemplate,
      text,
      name,
      path,
      action,
      _id: hid || id,
      attributes: { action },
    };

    // add it as a child of the parent node
    p.addChild(id, v);

    return [parent, id];
  }

  /**
   * Remove an item from the api
   * @param  {string} parent [A pipe, "|", seperated list of ids]
   * @param  {string} id     [A unique identifier for the element]
   * @return {boolean}       [A boolean to determine if successful or not.]
   */
  remove(parent, id) {
    // if there is no item, return null.
    if (this.root === null) return null;

    // find the parent
    const p = this.find(parent);
    // if we didn't find the parent return false...
    if (p === false) return false;

    // return true or false if the element was removed
    return p.removeChild(id);
  }

  /**
   * Edit a node by id
   * @param  {[type]} id      [description]
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  edit(id, options = {}) {
    // if there is no item, return null
    if (this.root === null) return null;

    const node = this.find(id);
    // if we didn't find the node return false...
    if (node === false) return false;

    return node.editValue(options);
  }

  /**
   * Recursively find an elemnt by the pipe seperated identiier
   * @param  {string} identifier [A pipe, "|", seperated list of ids]
   * @param  {Node|null} node
   * @return {boolean|Node}
   */
  find(identifier, node = this.root) {
    // solve for base case
    if (identifier === '') return node;

    // split the identifier by "|", and get the first element
    const ps = identifier.split('|');
    // if there's nothing in the ps after splitting
    if (ps.length < 1) return false;

    // get the current parent
    const currentParent = node.children[ps[0]];
    // if the item is not a child of the node return false
    if (typeof currentParent === 'undefined') return false;

    // remove the first id, then join the rest
    ps.shift();
    const newIdentifier = ps.join('|');

    // recursively find the element
    return this.find(newIdentifier, currentParent);
  }

  /**
   * Print all the nodes in the tree
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  print(node = this.root) {
    if (node === null) return null;

    console.log(node.value); // print action
    Object.values(node.children).forEach((n) => {
      this.print(n);
    });
    return true;
  }

  /**
   * Create the root node
   * @param  {string} text
   * @param  {Array|null} action
   * @return {string}
   */
  _createFirstNode(text, action) {
    // create a value from the valueTemplate
    const value = {
      ...this._valueTemplate,
      text,
      action,
      _id: '',
      name: 'Entry Node',
      attributes: { action },
    };
    // assign it as the root node;
    this.root = new Node(value);

    return '';
  }

  /**
   * Method to convert the ussd_core_api to
   * json format... for storage in the database.
   * @param  {Node|null} node
   * @return {string}      [description]
   */
  static serialize(node) {
    // base case.
    if (node === null) return JSON.stringify([]);

    // create a new queue.of nodes that need their children processed
    const queue = new Queue();
    // the output serialized USSDapi
    const output = [];

    // push the root node and the marker indecaating it's a parent node.
    output.push(node.value);
    output.push(USSDCore.MARKER);

    // add it to the queue
    queue.enqueue(node);

    while (!queue.isEmpty()) {
      // get the next node in the queue
      const activeNode = queue.dequeue();

      Object.values(activeNode.children).forEach((n) => {
        output.push(n.value);
        queue.enqueue(n);
      });

      output.push(USSDCore.MARKER);
    }

    return JSON.stringify(output);
  }

  /**
   * [deserialize description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  static deserialize(data) {
    // if the data is empty return null
    if (data.length === 0) return null;

    // create a new queue for the proper deserializing
    const queue = new Queue();
    // get the root node from the. data
    const rootNode = new Node(data[0]);

    // add the root to the queue
    queue.enqueue(rootNode);

    let i = 1;

    while (!queue.isEmpty()) {
      const activeNode = queue.dequeue();
      i += 1;
      while (!USSDCore.isMarker(data[i])) {
        const c = activeNode.addChild(data[i]._id, data[i]);
        queue.enqueue(c);
        i += 1;
      }
    }

    return USSDCore.createFromRoot(rootNode);
  }
}
