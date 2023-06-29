const assert = require('assert');
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

  for (const schemaName of Object.keys(doc.components.schemas)) {
    const schema = doc.components.schemas[schemaName];

    const arr = callSchemaTypeHandler({
      doc,
      schemaTypes,
      schema,
      isTypeDef: true,
    });

    stack.push(arr);
  }

  return stack;
}
