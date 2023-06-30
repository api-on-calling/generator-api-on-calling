/// <reference path="./types-comments.jsdoc.js" />

'use strict';

const {
  callSchemaTypeHandler,
  getScopedSign,
  getRefSchemaName,
  getObjectByRef,
  getSchemaDesc,
  getSchemaTitle,
} = require('./utils.jsdoc');
const constants = require('./constants.jsdoc');

const schemaTypes = {
  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  object(opts) {
    const stack = [];

    let schema = opts.schema;

    if (schema.allOf) {
      const allOf = schema.allOf;

      schema = {
        type: 'object',
        title: schema.title,
        description: schema.description,
        required: [],
        properties: {},
      };

      for (const item of allOf) {
        const itemSchema = item.$ref ? getObjectByRef(opts.doc, item.$ref) : item;

        if (!itemSchema) {
          continue;
        }

        if (itemSchema.title) {
          schema.title = itemSchema.title;
        }

        if (itemSchema.description) {
          schema.description = itemSchema.description;
        }

        if (Array.isArray(itemSchema.required)) {
          for (const key of itemSchema.required) {
            if (!schema.required.includes(key)) {
              schema.required.push(key);
            }
          }
        }

        if (itemSchema.properties) {
          for (const key of Object.keys(itemSchema.properties)) {
            schema.properties[key] = itemSchema.properties[key];
          }
        }
      }
    }

    const schemaType = opts.scopes.includes(constants.SCOPE_OBJ_IN_ARRAY) ? 'object[]' : 'object';

    if (opts.scopes.includes(constants.SCOPE_TYPEDEF)) {
      if (opts.isTypeDef) {
        stack.push(`${schema.description}`);
        stack.push(`@typedef {${schemaType}} ${schema.title}`);
      } else {
        stack.push(`@property {${schemaType}} ${schema.title} ${schema.description}`);
      }
    } else if (opts.scopes.includes(constants.SCOPE_FUNC_PARAMS)) {
      stack.push(`@param {${schemaType}} ${schema.title} ${schema.description}`);
    }

    if (!schema.properties) {
      // console.log(`[schemaTypes.object] - error: ${schema.title} - no properties`);
      return stack;
    }

    const requiredSchemaNames = Array.isArray(schema.required) ? schema.required : [];

    for (const schemaName of Object.keys(schema.properties)) {
      const subSchema = schema.properties[schemaName];

      let subSchemaTitle = subSchema.title || schemaName;

      if (opts.scopes.includes(constants.SCOPE_OBJ_IN_ARRAY)) {
        const parentTitle = opts.schema.title.replace(/^\[|\]$/g, '');
        subSchemaTitle = subSchemaTitle.replace(/^\[|\]$/g, '');
        subSchemaTitle = `${parentTitle}[].${subSchemaTitle}`;
      }

      subSchema.title = subSchemaTitle;
      subSchema.required = requiredSchemaNames.includes(schemaName);

      if (subSchema.$ref) {
        const sign = getScopedSign(opts.scope);
        const type = getRefSchemaName(subSchema.$ref);
        const title = getSchemaTitle(subSchema);
        const desc = getSchemaDesc(subSchema.description || getObjectByRef(opts.doc, subSchema.$ref)?.description);

        stack.push(`${sign} {${type}} ${title} ${desc}`);
        continue;
      }

      const arr = callSchemaTypeHandler({
        ...opts,
        schema: subSchema,
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

    const itemType = opts.schema.items.$ref ? getRefSchemaName(opts.schema.items.$ref) : opts.schema.items.type;

    if (itemType === 'object') {
      const stackSubObject = callSchemaTypeHandler({
        ...opts,
        schema: {
          ...opts.schema.items,
          title: opts.schema.title,
        },
        scopes: [constants.SCOPE_TYPEDEF, constants.SCOPE_OBJ_IN_ARRAY],
        isTypeDef: false,
      });

      stack.push(...stackSubObject);
    } else if (opts.scopes) {
      if (opts.scopes.includes(constants.SCOPE_TYPEDEF)) {
        if (opts.isTypeDef) {
          stack.push(`${opts.schema.description}`);
          stack.push(`@typedef {${itemType}[]} ${opts.schema.title}`);
        } else {
          stack.push(`@property {${itemType}[]} ${opts.schema.title} ${opts.schema.description}`);
        }
      } else if (opts.scopes.includes(constants.SCOPE_FUNC_PARAMS)) {
        stack.push(`@param {${itemType}[]} ${opts.schema.title} ${opts.schema.description}`);
      }
    }

    return stack;
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  string(opts) {
    return [`${getScopedSign(opts.scope)} {string} ${opts.schema.title} ${opts.schema.description}`];
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  integer(opts) {
    return [`${getScopedSign(opts.scope)} {number} ${opts.schema.title} ${opts.schema.description}`];
  },

  /**
   * @param {SchemaHandlerOptions} opts
   * @returns {string[]}
   */
  boolean(opts) {
    return [`${getScopedSign(opts.scope)} {boolean} ${opts.schema.title} ${opts.schema.description}`];
  },
};

module.exports = schemaTypes;
