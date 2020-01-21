import axios from 'axios';
import { BASE_API, PAGINATION_PER_PAGE } from './config';


export function index(options = {}) {
  return new Promise((resolve, reject) => {
    // build params obect
    const params = {
      with: options.with,
      page: options.page || 1,
      per_page: PAGINATION_PER_PAGE,
    };

    axios.get(`${BASE_API}/ussd_structures`, { params })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Get a structure by ID
 * @param  {[type]} id      [description]
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
export function get(id, options = {}) {
  return new Promise((resolve, reject) => {
    // build params
    const params = {
      with: options.with || undefined,
    };

    axios.get(`${BASE_API}/ussd_structures/${id}`, { params })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Create a new USSD Structure
 * @param  {object} structure
 * @return {Promise}
 */
export function create(channelId, structure) {
  return new Promise((resolve, reject) => {
    axios.post(
      `${BASE_API}/ussd_channels/${channelId}/ussd_structures/create`,
      structure,
    )
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Update a structure
 * @param  {[type]} structure [description]
 * @return {[type]}           [description]
 */
export function update(structure) {
  return new Promise((resolve, reject) => {
    // build request body
    const body = {
      label: structure.label || undefined,
      structure: structure.structure,
    };

    axios.patch(`${BASE_API}/ussd_structures/${structure.id}`, body)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Activate a specific structure
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function activate(id) {
  return new Promise((resolve, reject) => {
    axios.put(`${BASE_API}/ussd_structures/${id}/activate`)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Delete a specific structure
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
export function deleteStructure(id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${BASE_API}/ussd_structures/${id}`)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Get the list of actions
 * @return {[type]} [description]
 */
export function actions() {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_API}/ussd_actions`)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}
