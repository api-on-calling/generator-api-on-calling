'use strict';

const { join } = require('path');

const pathSourceRoot = join(__dirname, '..');

module.exports = {
  paths: {
    source: {
      root: pathSourceRoot,
      templates: join(pathSourceRoot, 'templates')
    }
  },
  messages: {
    welcome: 'Hello! Welcome coming to the api-on-calling yeoman generator scaffold !',
  },
  /**
   * @see {@link https://yeoman.github.io/generator/Generator.html#option}
   */
  options: {
    // service: {
    //   type: String,
    //   description: 'The service name(Camel Case), and hyphened as folder name',
    // },
  },
  /**
   * @see {@link https://github.com/SBoudrias/Inquirer.js}
   */
  prompts: [
    {
      name: 'service',
      type: 'input',
      message: 'What\'s the service name ?',
    },
    {
      name: 'lang',
      type: 'list',
      message: 'What\'s the target language of the service ?',
      choices: [
        'javascript-axios'
      ]
    },
    {
      name: 'schema-url',
      type: 'input',
      message: 'What\'s the url of the openapi schema ?'
    }
  ]
};
