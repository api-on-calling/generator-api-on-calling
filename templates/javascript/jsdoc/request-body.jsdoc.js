'use strict';

const { readObjectValue, getBodySchemaType } = require('./utils.jsdoc');

module.exports = requestBodyJsdoc;

/**
 * get requestBody schema
 * @param {object} opts
 * @param {object} opts.service
 * @param {object} opts.doc
 * @returns {string | undefined} - the responseBody type
 */
function requestBodyJsdoc(opts) {
  const content = readObjectValue(opts.service, 'requestBody.content');
  if (!content) {
    return;
  }

  const contentKeys = Object.keys(content);
  const key = contentKeys[0];
  if (!key) {
    return;
  }

  const contentData = content[key];
  if (!contentData) {
    return;
  }

  const schema = contentData.schema;
  if (!schema) {
    return;
  }

  return getBodySchemaType(schema);
}
