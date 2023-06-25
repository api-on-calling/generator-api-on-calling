'use strict';

const { request } = require('urllib-next');

/**
 * download the schema by url
 * @param {string} schemaUrl - schema url
 * @returns {object}
 */
exports.downloadSchema = async (schemaUrl) => {
  const { data } = await request(schemaUrl);
  return JSON.parse(data + '');
};
