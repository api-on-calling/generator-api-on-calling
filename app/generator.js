'use strict';

const yosay = require('yosay');
const assert = require('assert');
const { join } = require('path');
const Generator = require('yeoman-generator');
const { downloadSchema } = require('../common/network');
const config = require('./config');

class ApiOnCallingGenerator extends Generator {
  /**
   * the path of the language template async handler
   * @private
   */
  _pathLang = '';

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this._pathLang = join(config.paths.source.templates, this.options.lang);
  }

  async prompting() {
    this.log(yosay(config.messages.welcome));

    const prompts = [];

    for (const option of config.prompts) {
      if (!this.options[option.name]) {
        prompts.push(option);
      }
    }

    let langConfig;

    try {
      langConfig = require(join(this._pathLang, 'config.js'));
    } catch (err) {}

    if (Array.isArray(langConfig?.prompts)) {
      for (const option of langConfig.prompts) {
        if (!this.options[option.name]) {
          prompts.push(option);
        }
      }
    }

    if (prompts.length > 0) {
      const answers = await this.prompt(prompts);

      for (const key of Object.keys(answers)) {
        this.options[key] = answers[key];
      }
    }
  }

  async writing() {
    try {
      const lang = require(this._pathLang);

      assert.equal(
        lang.constructor.name,
        'AsyncFunction',
        `template lang:${this.options.lang} - is not async function`
      );

      const doc = await downloadSchema(this.options['schema-url']);

      assert.ok(
        !!doc && typeof doc === 'object',
        `schema-url: ${this.options['schema-url']} - no doc object`
      );

      await lang.call(this, doc);
    } catch (err) {
      console.log('[writing] - error', err);
      throw err;
    }
  }

  // install() { this.log('install step'); }
};

exports.ApiOnCallingGenerator = ApiOnCallingGenerator;
