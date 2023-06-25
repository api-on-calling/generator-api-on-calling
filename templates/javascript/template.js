'use strict';

const { buildObjectByPathname } = require('../../common/doc');

const SERVICE_NAMESPACE = 'service';

module.exports = JavaScriptApiOnCallingTemplate;

/**
 * Generate javascript api template string
 * @param {TemplateContext} ctx
 * @returns {TemplateResult}
 */
function JavaScriptApiOnCallingTemplate(ctx) {
  /**
   * the api object
   */
  let api = {};

  /**
   * template request str data
   * - service: { [pathname#method]: string }
   */
  const data = {
    [SERVICE_NAMESPACE]: {}
  };

  /**
   * the common options of some service
   * @type {ServiceCommonOptions}
   */
  const serviceCommonOptions = {
    ctx,
    pathname: '',
    method: '',
    service: null
  };

  for (const pathname of Object.keys(ctx.doc.paths)) {
    const pathnameObjectBuilt = buildObjectByPathname(api, pathname);
    const pathnameService = ctx.doc.paths[pathname];

    serviceCommonOptions.pathname = pathname;

    for (const method of Object.keys(pathnameService)) {
      const service = pathnameService[method];

      serviceCommonOptions.method = method;
      serviceCommonOptions.service = service;

      const serviceTemplateKey = getServiceTemplateKey(serviceCommonOptions);

      // api doc built <-- value
      pathnameObjectBuilt[method] = getAdapterString(serviceTemplateKey);

      // key --> value
      data[SERVICE_NAMESPACE][serviceTemplateKey] = getServiceTemplateString(serviceCommonOptions);
    }
  }

  if (api['']) {
    const baseApi = api[''];
    delete api[''];

    api = { ...baseApi, ...api, };
  }

  return { api, data, };
}

/**
 * the template context
 * @typedef {object} TemplateContext
 * @property {object} doc
 * @property {string} service - the service name
 */

/**
 * the template result
 * @typedef {object} TemplateResult
 * @property {object} api - the api object
 * @property {object} data - template data
 */

/**
 * @typedef {object} ServiceCommonOptions
 * @property {TemplateContext} ctx
 * @property {string} pathname - request pathname
 * @property {string} method - request method
 * @property {object} service - the service of the pathname#method
 */

/**
 * get service template string
 * @param {ServiceCommonOptions}
 * @returns {string}
 */
function getServiceTemplateString(options) {
  const { pathname, method, service } = options;

  const result = [
    `{`,
      `/**`,
      ` * - request: ${getServiceTemplateKey({ pathname, method })}`,
      !service.tags ? null :
      ` * - tags: ${service.tags.join(',')}`,
      !service.summary ? null :
      ` * @summary ${service.summary.replace(/\n/g, '\n * ')}`,
      !service.description ? null :
      ` * @description ${service.description.replace(/\n/g, '\n * ')}`,
      !service.externalDoc ? null :
      ` * @see {@link ${service.externalDoc.url}} ${service.externalDoc.description}`,
      ` */`,
      `async calling(options) {`,
      `  return await request({ pathname: '${pathname}', method: '${method}', options });`,
      `}`,
    `}`,
  ].filter(Boolean).join('\n');

  return result;
}

/**
 * get service template key
 * @param {ServiceCommonOptions} options
 * @returns {string}
 */
function getServiceTemplateKey(options) {
  return `${options.pathname}#${options.method}`;
}

/**
 * get service ejs template data key
 * @param {string} key - template data key
 * @returns {string}
 */
function getAdapterString(key) {
  return `<%= service['${key}'] %>`;
}
