'use strict';

const { buildObjectByPathname } = require('../../common/doc');
const config = require('./config');

const SERVICE_NAMESPACE = 'service';

module.exports = ApiOnCallingJavaScriptTemplate;

/**
 * Generate javascript api template string
 * @param {TemplateContext} ctx
 * @returns {TemplateResult}
 */
function ApiOnCallingJavaScriptTemplate(ctx) {
  /**
   * the api object
   */
  let api = {};

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

      // api doc built <-- value
      pathnameObjectBuilt[method] = getServiceTemplateString(serviceCommonOptions);
    }
  }

  if (api['']) {
    const baseApi = api[''];
    delete api[''];

    api = { ...baseApi, ...api, };
  }

  return { api };
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

  const stack = [];

  // template sign start
  stack.push(config.enums.TemplateSignEnum.START);

  // service start
  // ----------------------------------------
  stack.push('{');

  // comments
  // ----------------------------------------
  stack.push('/**');
  stack.push(`* - request: ${getServiceTemplateKey({ pathname, method })}`);

  if (service.tags) {
    stack.push(`* - tags: ${service.tags.join(',')}`);
  }

  if (service.summary) {
    stack.push(`* @summary ${service.summary.replace(/\n/g, '\n * ')}`);
  }

  if (service.description) {
    stack.push(`* @description ${service.description.replace(/\n/g, '\n * ')}`);
  }

  if (service.externalDoc) {
    stack.push(`* @see {@link ${service.externalDoc.url}} ${service.externalDoc.description}`);
  }

  stack.push(`*/`);

  // calling func
  // ----------------------------------------
  stack.push(`async calling(options) {`);
  stack.push(`return await request({ pathname: '${pathname}', method: '${method}', options });`);
  stack.push(`}`);

  // service end
  // ----------------------------------------
  stack.push(`}`);

  // template sign end
  // ----------------------------------------
  stack.push(config.enums.TemplateSignEnum.END);

  const result = stack.filter(Boolean).join('\n');

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
