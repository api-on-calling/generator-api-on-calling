'use strict';

const { join } = require('path');

const OptionsKeyEnum = {
  KEYWORD_REQUEST: 'javascript-keyword-request',
  PRETTIER_CONFIG: 'javascript-prettier-config',
  // TODO: frontend request client response dto
  RESPONSE_DTO: 'javascript-response-dto',
};

const TemplateSignEnum = {
  START: '@__TEMPLATE_START__@',
  END: '@__TEMPLATE_END__@',
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
    TemplateSignEnum,
  },
  prompts: [
    {
      name: OptionsKeyEnum.KEYWORD_REQUEST,
      type: 'input',
      message: "What's the keyword request string ? (use default)",
      required: false,
    },
    {
      name: OptionsKeyEnum.PRETTIER_CONFIG,
      type: 'input',
      message: "What's the prettier config ? (use default)",
      required: false,
    },
  ],
};
