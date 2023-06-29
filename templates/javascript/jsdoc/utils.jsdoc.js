/// <reference path="./components-schemas.jsdoc.js" />

'use strict';

const assert = require('assert');

/**
 * - e.g. #/components/schemas/someSchemaName -> someSchemaName
 * @param {string} ref 
 * @returns {string}
 */
exports.getRefSchemaName = (ref) => {
  return ref.replace(/[\S\s]+?\/([^/]+)$/, '$1');
};

/**
 * get schema title
 * @param {object} schema 
 * @param {boolean} [isTypeDef=false] 
 * @returns {string}
 */
exports.getSchemaTitle = (schema, isTypeDef = false) => {
  const title = exports.rmSchemaTitleGenericSign(schema.title);

  const isNotRequired = typeof schema.required === 'boolean' && !schema.required;

  if (!isTypeDef) {
    if (isNotRequired) {
      return `[${title}]`;
    }
    return title;
  }

  return title;
};

/**
 * remove schema title generic sign
 * @param {string} title - the schema title
 * @returns {string}
 */
exports.rmSchemaTitleGenericSign = (title) => {
  return (title || '').replace(/«|»/g, '');
};

/**
 * call specific schema type
 * @param {SchemaHandlerOptions} opts
 * @returns {string[]}
 */
exports.callSchemaTypeHandler = (opts) => {
  const handler = opts.schemaTypes[opts.schema.type];

  assert.ok(!!handler, `[callSchemaHandler]: error - no parser: ${opts.schema.type}`);
  // console.log('callSchemaTypeHandler - opts.schema', opts.schema);

  opts.isTypeDef = opts.isTypeDef || false;
  opts.prefix = opts.prefix || '';
  opts.schema = {
    ...opts.schema,
    title: exports.getSchemaTitle(opts.schema, opts.isTypeDef),
    description: exports.getSchemaDesc(opts.schema.description || '', opts.isTypeDef),
  };

  return handler(opts);
};

/**
 * get schema desc
 * @param {string} desc 
 * @param {boolean} slash
 * @returns {string}
 */
exports.getSchemaDesc = (desc, isTypeDef = false) => {
  if (!desc) {
    return '';
  }

  if (isTypeDef) {
    return desc;
  }

  return `- ${desc}`;
};

/**
 * get schema by ref
 * @param {object} doc 
 * @param {string} ref
 * @returns {any}
 */
exports.getSchemaByRef = (doc, ref) => {
  const key = ref.replace(/^#\//, '');

  return exports.readObjectValue(doc, key, '/');
};

/**
 * read object value
 * @param {object} obj
 * @param {string[] | string} keys
 * @param {string} sign
 * @returns {any}
 */
exports.readObjectValue = (obj, keys, sign = '.') => {
  if (typeof keys === 'string') {
    return exports.readObjectValue(obj, keys.split(sign));
  }

  const last = keys.pop();
  let cur = obj;

  for (const key of keys) {
    cur = cur[key];
    if (!cur) {
      return;
    }
  }

  return cur[last];
};
