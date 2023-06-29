/// <reference path="./types-comments.jsdoc.js" />

'use strict';

const assert = require('assert');
const { getRefSchemaName, getSchemaDesc, getSchemaByRef, callSchemaTypeHandler } = require('./utils.jsdoc');

const schemaTypes = {
  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  object(opts) {
    const stack = [];

    if (opts.isTypeDef) {
      stack.push(`${opts.schema.description}`);
      stack.push(`@typedef {object} ${opts.schema.title}`);
    } else {
      stack.push(`@property {object} ${opts.schema.title} ${opts.schema.description}`);
    }

    if (!opts.schema.properties) {
      // console.log(`[schemaTypes.object] - error: ${opts.schema.title} - no properties`);
      return stack;
    }

    const requiredSchemaNames = Array.isArray(opts.schema.required) ? opts.schema.required : [];

    for (const schemaName of Object.keys(opts.schema.properties)) {
      const val = opts.schema.properties[schemaName];

      let subSchema = val;

      if (val.$ref) {
        const refSchema = getSchemaByRef(opts.doc, val.$ref);

        subSchema = {
          ...refSchema,
          ...subSchema
        };
      }

      const arr = callSchemaTypeHandler({
        ...opts,
        schemaTypes,
        schema: { 
          ...subSchema, 
          title: schemaName,
          required: requiredSchemaNames.includes(schemaName),
        },
        isTypeDef: false,
      });

      stack.push(...arr);
    }

    return stack;
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  array(opts) {
    const stack = [];

    if (!opts.schema.items) {
      return stack;
    }

    const itemType = opts.schema.items.$ref ? 
      getRefSchemaName(opts.schema.items.$ref) :
      opts.schema.items.type;

    if (opts.isTypeDef) {
      stack.push(`${opts.schema.description}`);
      stack.push(`@typedef {${itemType}[]} ${opts.schema.title}`);
    } else {
      stack.push(`@property {${itemType}[]} ${opts.schema.title} ${opts.schema.description}`);
    }

    return stack;
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  string(opts) {
    return [`@property {string} ${opts.schema.title} ${opts.schema.description}`];
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  integer(opts) {
    return [`@property {number} ${opts.schema.title} ${opts.schema.description}`];
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  boolean(opts) {
    return [`@property {boolean} ${opts.schema.title} ${opts.schema.description}`];
  },
};

module.exports = schemaTypes;
