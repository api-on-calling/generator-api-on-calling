/**
 * @typedef {object} OpenapiV303Document
 * @property {object} paths
 * @property {object} components
 * @property {object} components.schemas
 * @property {object} components.parameters
 */

/**
 * @typedef {object} ApiSchema
 * @property {string} schema.title
 * @property {string} [schema.type]
 * @property {string} [schema.allOf]
 * @property {string} [schema.description]
 * @property {string} [schema.ref]
 * @property {object} [schema.items]
 * @property {string[]} [schema.required]
 * @property {object} [schema.properties]
 */

/**
 * @typedef {object} SchemaHandlerOptions
 * @property {object} schemaTypes
 * @property {ApiSchema} schema
 * @property {boolean} isTypeDef
 * @property {string} prefix
 * @property {object} doc
 * @property {string[]} scopes - 'typedef' | 'func_params' | 'obj_in_array'
 */

/**
 * @typedef {object} OpenapiV303Parameter
 * @property {string} name
 * @property {string} description
 * @property {('path' | 'query')} in
 * @property {boolean} required
 * @property {object} schema
 * @property {('string' | 'boolean' | 'integer')} schema.type
 * @property {string[] | number[]} [schema.enum]
 */
