'use strict';

const { getBodySchemaType, readObjectValue } = require('./utils.jsdoc');

module.exports = responseBodyJsdoc;

/**
 * get requestBody schema
 * @param {object} opts
 * @param {object} opts.service
 * @param {object} opts.doc
 * @returns {string | undefined} - the responseBody type
 */
function responseBodyJsdoc(opts) {
  const propKeys = ['responses.200.content', 'responses.201.content'];

  let content;

  for (const propKey of propKeys) {
    content = readObjectValue(opts.service, propKey);
    if (content) {
      break;
    }
  }

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
