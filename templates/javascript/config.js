'use strict';

const { join } = require('path');

const OptionsKeyEnum = {
  KEYWORD_REQUEST: 'javascript-keyword-request',
  PRETTIER_CONFIG: 'javascript-prettier-config'
};

module.exports = {
  paths: {
    template: {
      index: join(__dirname, 'template/index.ejs'),
      prettierConfig: join(__dirname, 'template/.prettierrc.js'),
      keywordRequest: join(__dirname, 'template/keyword-request.partial.ejs'),
    },
  },
  enums: {
    OptionsKeyEnum,
  },
  prompts: [
    {
      name: OptionsKeyEnum.KEYWORD_REQUEST,
      type: 'input',
      message: 'What\'s the your keyword request string? (use default)',
      required: false
    },
    {
      name: OptionsKeyEnum.PRETTIER_CONFIG,
      type: 'input',
      message: 'What\'s the your prettier config? (use default)',
      required: false
    }
  ]
};
