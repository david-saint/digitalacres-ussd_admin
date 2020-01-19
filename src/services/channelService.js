import axios from 'axios';
import { BASE_API, PAGINATION_PER_PAGE } from './config';

/**
 * method to get all the channels.
 * @return {[type]} [description]
 */
export function index(options = {}) {
  return new Promise((resolve, reject) => {
    // build the params object.
    const params = {
      page: options.page || undefined,
      perPage: PAGINATION_PER_PAGE,
      'with': options.with || undefined, // eslint-disable-line
    };

    axios.get(`${BASE_API}/ussd_channels`, { params })
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Method to create a new channel
 * @param  {[type]} channel [description]
 * @return {[type]}         [description]
 */
export function create(channel) {
  return new Promise((resolve, reject) => {
    axios.post(`${BASE_API}/ussd_channels`, channel)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

/**
 * Method to create a new channel
 * @param  {[type]} channel [description]
 * @return {[type]}         [description]
 */
export function update(channel) {
  return new Promise((resolve, reject) => {
    // build body object
    const body = {
      label: channel.label || '',
      endpoint: channel.endpoint || '',
    };

    axios.patch(`${BASE_API}/ussd_channels/${channel.id}`, body)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}

export function deleteChannel(id) {
  return new Promise((resolve, reject) => {
    axios.delete(`${BASE_API}/ussd_channels/${id}`)
      .then(({ data }) => resolve(data))
      .catch((err) => reject(err));
  });
}
