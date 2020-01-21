import Node from './node';

export default class Queue {
  /**
   * Initialize a new queue. with reference to the
   * first, last and size of the queue.
   * @return {void}
   */
  constructor() {
    // the number of elemnts in the queue
    this.size = 0;
    // the last element in the queue
    this.last = null;
    // the frist element in the queue.
    this.first = null;
  }

  /**
   * Add an item to the end of the queue.
   * @param  {any} value
   * @return {number}
   */
  enqueue(value) {
    // create a new node from the value
    const n = new Node(value);

    if (this.first === null) this._pushFirstNode(n);
    else this._pushNode(n);

    // increment the size of the queue
    this.size += 1;
    return this.size;
  }

  /**
   * Remove the first item on the queue.
   * @return {any}
   */
  dequeue() {
    // if the queue is empty return null
    if (this.first === null) return null;

    const pre = this.first;
    this.first = pre.next;

    if (this.first === null) { this.last = null; }

    this.size -= 1;
    return pre.value;
  }

  /**
   * push a root node to the queue.
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  _pushFirstNode(node) {
    this.first = node;
    this.last = node;
  }

  /**
   * Push a non root node to the quueu
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  _pushNode(node) {
    // if there's no last node we can't do anything
    if (this.last === null) return;

    this.last.next = node;
    this.last = node;
  }

  /**
   * Determine if the queue is empty
   * @return {Boolean}
   */
  isEmpty() { return !(this.size); }
}
