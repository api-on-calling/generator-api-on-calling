/// <reference path="./components-schemas.jsdoc.js" />

'use strict';

const assert = require('assert');
const constants = require('./constants.jsdoc');

/**
 * - e.g. #/components/schemas/someSchemaName -> someSchemaName
 * @param {string} ref
 * @returns {string}
 */
exports.getRefSchemaName = (ref) => {
  return exports.rmGenericSign(ref.replace(/[\S\s]+?\/([^/]+)$/, '$1'));
};

/**
 * @param {object} schema
 * @param {boolean} [isTypeDef=false]
 * @returns {string}
 */
exports.getSchemaTitle = (schema, isTypeDef = false) => {
  // TODO: prefix + title
  const title = exports.rmGenericSign(schema.title);

  if (!isTypeDef) {
    return exports.resolveTitleByRequired(
      title,
      typeof schema.required !== 'boolean' ? true : schema.required,
      schema.default
    );
  }

  return title;
};

/**
 * @param {string} title
 * @param {boolean} required
 * @param {any} [defaultVal]
 * @returns {string}
 */
exports.resolveTitleByRequired = (title, required, defaultVal) => {
  if (!required) {
    return typeof defaultVal !== 'undefined' ? `[${title}=${defaultVal}]` : `[${title}]`;
  }
  return title;
};

/**
 * remove schema title generic sign
 * @param {string} title - the schema title
 * @returns {string}
 */
exports.rmGenericSign = (title) => {
  // return (title || '').replace(/«[^»,]+,[^»,]+»/g, '').replace(/«|»/g, '');
  return (title || '').replace(/«/g, '__').replace(/»/g, '').replace(/,/g, '_');
};

/**
 * call specific schema type
 * @param {SchemaHandlerOptions} opts
 * @returns {string[]}
 */
exports.callSchemaTypeHandler = (opts) => {
  const handler = opts.schema.allOf ? opts.schemaTypes.object : opts.schemaTypes[opts.schema.type];

  if (!handler) {
    console.log('[callSchemaHandler]: error - schema', opts.schema);
  }
  assert.ok(!!handler, `[callSchemaHandler]: error - no parser: ${opts.schema.type}`);
  // console.log('callSchemaTypeHandler - opts.schema', opts.schema);

  opts.scopes = opts.scopes || [];
  opts.isTypeDef = opts.isTypeDef || false;
  opts.prefix = opts.prefix || '';
  opts.schema = {
    ...opts.schema,
    title: exports.getSchemaTitle(opts.schema, opts.isTypeDef, opts.prefix),
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
exports.getObjectByRef = (doc, ref) => {
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

/**
 * @param {('typedef' | 'func_params')} scope
 */
exports.getScopedSign = (scope) => {
  return scope === constants.SCOPE_FUNC_PARAMS ? '@param' : '@property';
};

/**
 * @param {ApiSchema} schema
 */
exports.getBodySchemaType = (schema) => {
  // object
  if (schema.$ref) {
    return exports.rmGenericSign(exports.getRefSchemaName(schema.$ref));
  }

  // array
  if (schema.type === 'array') {
    if (schema.items?.$ref) {
      return exports.rmGenericSign(exports.getRefSchemaName(schema.items.$ref)) + '[]';
    }

    if (exports.isEnumType(schema.items)) {
      return exports.getEnumType(schema.items);
    }

    return schema.items.type + '[]';
  }

  return schema.type;
};

/**
 * @param {ApiSchema} schema
 * @returns {string}
 */
exports.getEnumType = (schema) => {
  return '(' + (schema.type !== 'string' ? schema.enum.join(' | ') : "'" + schema.enum.join("' | '") + "'") + ')';
};

/**
 * @param {ApiSchema} schema
 * @returns {boolean}
 */
exports.isEnumType = (schema) => {
  return schema && Array.isArray(schema.enum) && schema.enum.length > 0;
};
