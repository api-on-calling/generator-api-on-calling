/// <reference path="./types-comments.jsdoc.js" />

const { getObjectByRef } = require('./utils.jsdoc');

module.exports = jsdocParameters;

/**
 * @param {OpenapiV303Parameter[]} parameters
 * @param {OpenapiV303Document} doc
 * @returns {string[]}
 */
function jsdocParameters(parameters, doc) {
  const stack = [];

  stack.push(...parseParameters(parameters, 'path', doc));
  stack.push(...parseParameters(parameters, 'query', doc));

  return stack.map((param) => '@param ' + param);
}

/**
 * @param {object[]} parameters
 * @param {('path'|'query')} type
 * @param {OpenapiV303Document} doc
 * @returns {string[]}
 */
function parseParameters(parameters, type, doc) {
  const stack = [];

  const arr = parameters
    .map((param) => {
      if (!param.$ref) {
        return param;
      }

      const paramRef = getObjectByRef(doc, param.$ref);

      return { ...paramRef, ...param };
    })
    .filter((param) => param.in === type);

  if (!arr.length) {
    return stack;
  }

  const prefix = `options.${type}`;

  for (const param of arr) {
    stack.push(...parseSingleParam(prefix, param));
  }

  if (stack.length > 0) {
    stack.unshift(`{object} ${prefix}`);
  }

  return stack;
}

/**
 * parse single param
 * @param {string} prefix
 * @param {object} param
 * @returns {string[]}
 */
function parseSingleParam(prefix, param) {
  const stack = [];

  if (!param.schema || !param.schema.type) {
    return stack;
  }

  param.description = param.description || '';

  let prefixName = `${prefix}.${param.name}`;
  if (!param.required) {
    prefixName = `[${prefixName}]`;
  }

  let str = '';

  if (param.schema.enum) {
    str += `{(${param.schema.enum.join('|')})} ${prefixName} - ${param.description}`;
  } else {
    switch (param.schema.type) {
      case 'string':
        str += `{string} ${prefixName} - ${param.description}`;
        break;

      case 'integer':
        str += `{number} ${prefixName} - ${param.description}`;
        break;

      case 'boolean':
        str += `{boolean} ${prefixName} - ${param.description}`;
        break;
    }
  }

  if (str) {
    stack.unshift(str);
  }

  return stack;
}
