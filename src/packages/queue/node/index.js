export default class Node {
  /**
   * Initialize a new node with a value.
   * @param  {any} value
   * @return {void}
   */
  constructor(value) {
    // pointer to the next node in the queue
    this.next = null;
    // the value of this node;
    this.value = value;
  }
}
