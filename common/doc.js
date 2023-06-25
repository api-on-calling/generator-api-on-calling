'use strict';

const regCommonParam = /^{([\w]+)}$/;

const regSpecialParam = /^{[\w-]+}$/;

const regSlashWordGlobal = /-+([a-zA-Z])/g;

const regWord = /^[$\w]+$/;

/**
 * @example ApiService -> api-service
 * @param {string} str - string to be hyphenated
 * @returns {string}
 */
exports.hyphenate = (str) => {
  if (!str?.length) {
    return '';
  }

  return str[0].toLowerCase() + str.slice(1).replace(/[A-Z]/g, (s) => '-' + s.toLowerCase());
};

/**
 * build object structure by pathname
 * - make an empty object if given key is not defined on the object
 * - define the the object structure
 * @param {object} obj
 * @param {string} pathname
 * @returns {any}
 */
exports.buildObjectByPathname = (obj, pathname) => {
  const keys = exports.getPathnameKeys(pathname);
  let cur = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (!cur[key]) {
      cur[key] = {};
    }

    cur = cur[key];
  }

  return cur;
};

/**
 * converts the alphabet to the uppercased case
 * - used by regSlashWordGlobal
 * @param {string} s
 * @param {string} $1
 * @returns {string}
 */
function getAlphabetUpperCase(s, $1) {
  return $1.toUpperCase();
}

/**
 * getPathnameKeys
 * @param {string} pathname - the request pathname
 * @returns {string[]}
 */
exports.getPathnameKeys = (pathname) => {
  return pathname.replace(/^\/+/, '').split('/').map((key) => {
    // {yyy} -> $yyy
    if (regCommonParam.test(key)) {
      return '$' + key.replace(regCommonParam, '$1');
    }

    // {a---bcd} -> {aBcd}
    if (regSpecialParam.test(key)) {
      return '$' + key.replace(regSlashWordGlobal, getAlphabetUpperCase);
    }

    return key;
  });
};

/**
 * getKeyStringByPathname
 * @param {string} pathname - the request pathname
 * @returns {string}
 */
exports.getKeyStringByPathname = (pathname) => {
  const keys = exports.getPathnameKeys(pathname);

  let result = '';

  for (const key of keys) {
    if (!regWord.test(key)) {
      result += `['${key}']`;
      continue;
    }

    result += `.${key}`;
  }

  if (result[0] === '.') {
    return result.slice(1);
  }

  return result;
};

/**
 * get service key
 * - default splitter is .
 * - 2.0 -> ['2.0']
 * @param {string} serviceName - the service name
 * @param {string} pathname - request pathname
 * @param {string} method - request method
 * @returns {string}
 */
exports.getServiceKey = (serviceName, pathname, method) => {
  const pathKey = exports.getKeyStringByPathname(pathname);

  let prefix = '';

  if (!pathKey) {
    prefix = serviceName;
  } else if (pathKey[0] === '[') {
    prefix = `${serviceName}${pathKey}`;
  } else {
    prefix = `${serviceName}.${pathKey}`;
  }

  return `${prefix}.${method}`;
};

/**
 * get template key
 * - default splitter is _
 * @param {string} serviceName - the service name
 * @param {string} pathname - request pathname
 * @param {string} method - request method
 * @returns {string}
 */
exports.getTemplateKey = (serviceName, pathname, method) => {
  return exports.getServiceKey(serviceName, pathname, method).replace(/\./g, '_');
};
