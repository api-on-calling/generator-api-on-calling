'use strict';

const { expect, test } = require('@jest/globals');
const { callSchemaTypeHandler } = require('./utils.jsdoc');
const componentsSchemas = require('./components-schemas.jsdoc');
const schemaTypes = require('./schema-types.jsdoc');
const { downloadSchema } = require('../../../common/network');

describe('test schema types', () => {
  test('schema - object', () => {
    const schema = {
      type: 'object',
      title: 'SomeObjectDTO',
      description: 'some obj dto desc',
      required: false,
      properties: {
        isViewAll: { type: 'integer', format: 'int32' },
        list: { type: 'array', items: { $ref: '#/components/schemas/InfoResponseDTO' } },
        pageNo: { type: 'integer', format: 'int32' },
        pageSize: { type: 'integer', format: 'int32' },
        total: { type: 'integer', format: 'int64' },
      },
    };

    const arr = callSchemaTypeHandler({
      schemaTypes,
      schema,
      isTypeDef: true,
    });
    // console.log('arr', arr);
    expect(arr).toBeTruthy();
  });

  test('somedata', async () => {
    const doc = await downloadSchema('http://localhost:4000/somedata.json');
    // console.log('doc', doc);

    const arr = componentsSchemas(doc);

    // console.log('arr', arr);

    expect(arr).toBeTruthy();
  });
});
