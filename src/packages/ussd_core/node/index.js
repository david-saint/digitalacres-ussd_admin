export default class Node {
  /**
   * Initialize a new node with a value of type stubs/value.json
   * @param  {any} value
   * @return {void}
   */
  constructor(value) {
    // store the value of the node.
    this.value = value;
    // create an empty array that'll hold the children.
    this.children = {};
  }

  /**
   * Add an element to the children hashmap of the node.
   * @param {string} id
   * @param {any} value
   * @return {Node} the added node
   */
  addChild(id, value) {
    // add the element to the children hashMap
    this.children[id] = new Node(value);
    // change the value MARKER
    this.value = { ...this.value, MARKER: true };

    return this.children[id];
  }

  /**
   * Remove an element from the children list.
   * @param  {string} id
   * @return {void}
   * @return {Number} the number of children it has
   */
  removeChild(id) {
    // remove the element entirely
    delete this.children[id];
    // determine if it has children
    const hasChild = Object.entries(this.children).length === 0;
    // change the value MARKER
    this.value = { ...this.value, MARKER: hasChild };

    return Object.entries(this.children).length;
  }

  /**
   * Edit the value of the node
   * @param  {Object} options [description]
   * @return {[type]}         [description]
   */
  editValue(options = {}) {
    this.value = {
      ...this.value,
      ...options,
    };
    if (typeof options.action !== 'undefined') {
      this.value.attributes.action = options.action;
    }
    return this.value;
  }

  /**
   * Method to get a child by an index
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  getChildByIndex(index) {
    const id = Object
      .keys(this.children)
      .filter((i) => i !== process.env.ERROR_NODE_ID)[index];
    return this.children[id];
  }

  /**
   * Method to determine if the node has children
   * @return {Boolean} [description]
   */
  hasChildren() { return !!Object.keys(this.children).length; }

  /**
   * Return the node's value according to
   * whether it has children or not.
   * @return {[type]} [description]
   */
  toResponse() {
    // determine the prepend
    const prepend = this.hasChildren() ? 'CON' : 'END';

    return `${prepend} ${this.value.text}`;
  }

  /**
   * Convert to object format
   * @return {[type]} [description]
   */
  toObject() {
    const children = Object.values(this.children).map((c) => c.toObject());
    return {
      ...this.value,
      children,
    };
  }
}
