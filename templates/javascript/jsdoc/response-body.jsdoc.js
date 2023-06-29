'use strict';

const { getRefSchemaName, readObjectValue } = require('./utils.jsdoc');

module.exports = responseBodyJsdoc;

/**
 * get requestBody schema
 * @param {object} opts
 * @param {object} opts.service
 * @param {object} opts.doc
 * @returns {string | undefined} - the responseBody type
 */
function responseBodyJsdoc(opts) {
  const content = readObjectValue(opts.service, 'responses.200.content');
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

  // assert.ok(schema.$ref, `[responseBodyJsdoc] error: ${opts.service.title} -  requestBody no schema ref`);
  if (!schema.$ref) {
    // TODO: handling common schema
    return;
  }

  return getRefSchemaName(schema.$ref);
}
