'use strict';

const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { mkdirp } = require('mkdirp');
const prettier = require('prettier');
const { hyphenate } = require('../../common/doc');
const template = require('./template');
const config = require('./config');

/**
 * javascript api template writer
 * @this import('../../app/generator').ApiOnCallingGenerator
 * @param {object} doc - openapi schema doc
 */
module.exports = async function (doc) {
  const hyphen = hyphenate(this.options.service);
  const targetPath = this.destinationPath(hyphen);
  // console.log('targetPath', targetPath);

  if (!this.existsDestination(targetPath)) {
    await mkdirp(targetPath);
  }

  // ---------------------------------------------------------------

  if (!this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG]) {
    this.fs.write(this.destinationPath(`${hyphen}/.prettierrc.js`), await readFile(config.paths.template.prettierConfig, 'utf-8'));

    this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG] = config.paths.template.prettierConfig;
  }

  if (!this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST]) {
    this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST] = await readFile(config.paths.template.keywordRequest, 'utf-8');
  }

  // ---------------------------------------------------------------

  const prettierConfig = require(this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG]);

  // ---------------------------------------------------------------

  const result = template({
    doc,
    service: this.options.service,
  });

  const { api, data } = result;

  // templateStr0
  // ---------------------------------------------------------------

  let templateStr0 = await readFile(config.paths.template.index, 'utf-8');
  const apiContent = JSON.stringify(api, null, 2);
  // console.log('[apiContent]', JSON.stringify(api, null, 2));
  // console.log('data', data);
  // console.log('apiTemplateStr', apiTemplateStr);
  // console.log('apiContent', apiContent);

  // templateStr1
  // ---------------------------------------------------------------

  let templateStr1 = ejs.compile(templateStr0)({
    service: this.options.service,
    content: apiContent,
    keywordRequest: this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST]
  });

  templateStr1 = templateStr1.replace(/\\?"<%/g, '<%')
    .replace(/%>\\?"/g, '%>');

  // console.log('templateStr1', templateStr1);
  // console.log('data', data);
  // console.log('------------------------------------');

  // templateStr2
  // ---------------------------------------------------------------

  let templateStr2 = ejs.compile(templateStr1)(data);
  // console.log('templateStr2', templateStr2);
  // console.log('------------------------------------');

  templateStr2 = templateStr2.replace(/&#39;/g, '"');
  // console.log('templateStr2', templateStr2);
  // console.log('------------------------------------');

  // templateStr3
  // ---------------------------------------------------------------

  const templateStr3 = prettier.format(templateStr2, prettierConfig);

  // ---------------------------------------------------------------

  // console.log('templateStr3', templateStr3);
  this.fs.write(this.destinationPath(`${hyphen}/index.js`), templateStr3);
};
