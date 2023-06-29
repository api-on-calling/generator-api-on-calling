'use strict';

const { readFile } = require('fs/promises');
const ejs = require('ejs');
const { mkdirp } = require('mkdirp');
const prettier = require('prettier');
const { hyphenate } = require('../../common/doc');
const template = require('./template');
const config = require('./config');

const regCodeQuote = /&#39;/g;
const regChangeLine = /\\n/g;
const regTemplateSignStart = new RegExp('"' + config.enums.TemplateSignEnum.START, 'g');
const regTemplateSignEnd = new RegExp(config.enums.TemplateSignEnum.END + '"', 'g');

/**
 * javascript api template writer
 * @this import('../../app/generator').ApiOnCallingGenerator
 * @param {object} doc - openapi schema doc
 */
module.exports = async function (doc) {
  const hyphen = hyphenate(this.options.service);
  const targetPath = this.destinationPath(hyphen);

  if (!this.existsDestination(targetPath)) {
    await mkdirp(targetPath);
  }

  await normalizeOptions.call(this);

  const str = await generateTemplateString.call(this, doc);

  this.fs.write(this.destinationPath(`${hyphen}/index.js`), str);
};

/**
 * @this import('../../app/generator').ApiOnCallingGenerator
 */
async function normalizeOptions() {
  if (!this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG]) {
    this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG] = config.paths.template.prettierConfig;
  }

  if (!this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST]) {
    this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST] = await readFile(
      config.paths.template.keywordRequest,
      'utf-8'
    );
  }
}

/**
 * @this import('../../app/generator').ApiOnCallingGenerator
 * @param {object} doc - openapi schema doc
 * @returns {string}
 */
async function generateTemplateString(doc) {
  const result = template({ doc, service: this.options.service });
  const apiContent = JSON.stringify(result.api, null, 2);

  const templateStr = await readFile(config.paths.template.index, 'utf-8');

  let str = ejs.compile(templateStr)({
    service: this.options.service,
    content: apiContent,
    keywordRequest: this.options[config.enums.OptionsKeyEnum.KEYWORD_REQUEST],
  });

  str = str
    .replace(regCodeQuote, '"')
    .replace(regChangeLine, '\n')
    .replace(regTemplateSignStart, '')
    .replace(regTemplateSignEnd, '');

  // prettier
  // ----------------------
  const prettierConfig = require(this.options[config.enums.OptionsKeyEnum.PRETTIER_CONFIG]);

  str = prettier.format(str, prettierConfig);

  str += '\n\n' + result.jsdocTypes;

  return str;
}
