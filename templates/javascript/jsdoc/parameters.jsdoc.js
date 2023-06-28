
module.exports = jsdocParameters;

/**
 * @param {object[]} parameters
 * @param {string} parameters[].name
 * @param {string} parameters[].description
 * @param {boolean} parameters[].required
 * @param {object} parameters[].schema
 * @param {('string' | 'boolean' | 'integer')} parameters[].schema.type
 * @param {string[] | number[]} [parameters[].schema.enum]
 * @returns {string[]}
 */
function jsdocParameters(parameters) {
  const stack = [];

  stack.push(...parseParameters(parameters, 'path'));
  stack.push(...parseParameters(parameters, 'query'));

  return stack.map((param) => '@param ' + param);
}

/**
 * @param {object[]} parameters
 * @param {('path'|'query')} type 
 * @returns {string[]}
 */
function parseParameters(parameters, type) {
  const stack = [];

  const arr = parameters.filter((item) => item.in === type);

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
