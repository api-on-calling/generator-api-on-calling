'use strict';

const { request } = require('urllib-next');

/**
 * download the schema by url
 * - TODO: currently only supports openapi json doc data
 * @param {string} schemaUrl - schema url
 * @returns {object}
 */
exports.downloadSchema = async (schemaUrl) => {
  const { data } = await request(schemaUrl);
  return JSON.parse(data + '');
};
