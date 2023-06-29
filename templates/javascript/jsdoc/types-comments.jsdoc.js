/**
 * @typedef {object} OpenapiV303Document
 * @property {object} paths
 * @property {object} components
 * @property {object} components.schemas
 * @property {object} components.parameters
 */

/**
 * @typedef {object} ApiSchema
 * @property {string} schema.type
 * @property {string} schema.title
 * @property {string} schema.description
 * @property {object} [schema.properties]
 * @property {object} [schema.items]
 * @property {string[]} [schema.required]
 */

/**
 * @typedef {object} SchemaHandlerOptions
 * @property {object} schemaTypes
 * @property {ApiSchema} schema
 * @property {boolean} isTypeDef
 * @property {string} prefix
 * @property {object} doc
 * @property {('typedef' | 'func_params')} scope
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
