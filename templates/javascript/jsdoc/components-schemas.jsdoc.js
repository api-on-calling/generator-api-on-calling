'use strict';

const constants = require('./constants.jsdoc');
const schemaTypes = require('./schema-types.jsdoc');
const { callSchemaTypeHandler } = require('./utils.jsdoc');

module.exports = componentsSchemasJsdoc;

/**
 * @param {object} doc
 * @param {object} doc.components
 * @param {object} doc.components.schemas
 * @returns {string[][]}
 */
function componentsSchemasJsdoc(doc) {
  const stack = [];

  if (!doc.components?.schemas) {
    return stack;
  }

  for (const schemaName of Object.keys(doc.components.schemas)) {
    const schema = doc.components.schemas[schemaName];

    schema.title = schemaName;

    const arr = callSchemaTypeHandler({
      doc,
      scopes: [constants.SCOPE_TYPEDEF],
      isTypeDef: true,
      schemaTypes,
      schema,
    });

    stack.push(arr);
  }

  return stack;
}
